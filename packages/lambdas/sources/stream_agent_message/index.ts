/// <reference path="./awslambda.d.ts" />
import { Writable } from 'stream'
import http from 'http'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { extractUserObjectFromEvent } from '@kairos-lambdas-libs/middleware/utils/extractUserFromEvent'
import { extractProjectFromEvent } from '@kairos-lambdas-libs/middleware/utils/extractProjectFromEvent'
import { query, getItem } from '@kairos-lambdas-libs/dynamodb/commands'
import { DynamoDBTable, DynamoDBIndex } from '@kairos-lambdas-libs/dynamodb/enums'
import { ITodoItem } from '@kairos-lambdas-libs/dynamodb/types/todoList'
import { IGroceryItem } from '@kairos-lambdas-libs/dynamodb/types/groceryList'
import { INoiseTracking } from '@kairos-lambdas-libs/dynamodb/types/noiseTracking'
import { IShop } from '@kairos-lambdas-libs/dynamodb/types/shops'
import { IUserPreferences } from '@kairos-lambdas-libs/dynamodb/types/userPreferences'

interface StreamEvent {
  headers?: Record<string, string>
  body?: string
}

interface ConversationTurn {
  role: 'user' | 'agent'
  content: string
}

const HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Project-ID',
}

const AGENT_EC2_URL = process.env.AGENT_EC2_URL ?? ''
const AGENT_SECRET = process.env.AGENT_SECRET ?? ''

const writeSSE = (stream: NodeJS.WritableStream, data: unknown) => {
  stream.write(`data: ${JSON.stringify(data)}\n\n`)
}

const fetchUserData = async (projectId: string, userId: string) => {
  const [todoItems, groceryItems, noiseItems, shops, userPreferences] = await Promise.all([
    query<typeof DynamoDBTable.TODO_LIST>({
      tableName: DynamoDBTable.TODO_LIST,
      indexName: DynamoDBIndex.TODO_LIST_PROJECT,
      attributes: { projectId },
    }),
    query<typeof DynamoDBTable.GROCERY_LIST>({
      tableName: DynamoDBTable.GROCERY_LIST,
      indexName: DynamoDBIndex.GROCERY_LIST_PROJECT,
      attributes: { projectId },
    }),
    query<typeof DynamoDBTable.NOISE_TRACKING>({
      tableName: DynamoDBTable.NOISE_TRACKING,
      indexName: DynamoDBIndex.NOISE_TRACKING_PROJECT,
      attributes: { projectId },
    }),
    query<typeof DynamoDBTable.SHOPS>({
      tableName: DynamoDBTable.SHOPS,
      indexName: DynamoDBIndex.SHOPS_PROJECT,
      attributes: { projectId },
    }),
    getItem<IUserPreferences>({
      tableName: DynamoDBTable.USER_PREFERENCES,
      item: { userId },
    }),
  ])

  return { todoItems, groceryItems, noiseItems, shops, userPreferences }
}

const buildSystemPrompt = (
  userName: string,
  data: Awaited<ReturnType<typeof fetchUserData>>
) => {
  const today = new Date().toISOString().split('T')[0]

  const pendingTodos = data.todoItems.filter(t => !t.isDone).slice(0, 50)
  const todoSection = pendingTodos.length > 0
    ? pendingTodos.map(t => {
      const due = t.dueDate ? ` (due: ${new Date(t.dueDate).toLocaleDateString()})` : ''
      return `- ${t.name}${due}`
    }).join('\n')
    : '(none)'

  const grocerySection = data.groceryItems.slice(0, 50).length > 0
    ? data.groceryItems.slice(0, 50).map(g => {
      const cat = g.category ? ` [${g.category}]` : ''
      return `- ${g.name}: ${g.quantity} ${g.unit}${cat}`
    }).join('\n')
    : '(none)'

  const shopsSection = data.shops.length > 0
    ? data.shops.map(s => `- ${s.name}`).join('\n')
    : '(none)'

  const sortedNoise = [...data.noiseItems].sort((a, b) => b.timestamp - a.timestamp)
  const latestNoise = sortedNoise[0]
  const noiseSection = latestNoise
    ? `- Latest recording: ${new Date(latestNoise.timestamp).toLocaleString()}\n- Total recordings this month: ${sortedNoise.filter(n => {
      const d = new Date(n.timestamp)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length}`
    : '(no recordings)'

  return `You are Kairos Agent, a helpful assistant for the Kairos household management app.
You are speaking with ${userName}.
You have READ-ONLY access to their data — you CANNOT add, delete, or modify items.
If asked to change something, explain they need to use the app interface.
Be concise, friendly, and helpful.

Current date: ${today}

=== USER DATA ===
## Todo List — Pending (${pendingTodos.length}):
${todoSection}

## Grocery List (${data.groceryItems.length} items):
${grocerySection}

## Shops (${data.shops.length}):
${shopsSection}

## Noise Tracking:
${noiseSection}
=== END DATA ===`
}

const streamFromEC2 = (
  message: string,
  systemPrompt: string,
  conversationHistory: ConversationTurn[],
  httpStream: NodeJS.WritableStream
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const url = new URL('/stream', AGENT_EC2_URL)
    const postData = JSON.stringify({ message, systemPrompt, conversationHistory })

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AGENT_SECRET}`,
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          writeSSE(httpStream, { type: 'error', content: 'Agent service unavailable' })
          resolve()
          return
        }

        let buffer = ''
        let sentResult = false

        // Claude CLI stream-json outputs concatenated JSON objects without newline separators.
        // We parse them by tracking brace depth.
        const parseAndEmit = (json: string) => {
          try {
            const parsed = JSON.parse(json)
            if (parsed.type === 'result' && parsed.result && !sentResult) {
              sentResult = true
              writeSSE(httpStream, { type: 'text_delta', content: parsed.result })
            }
          } catch {
            // malformed JSON, skip
          }
        }

        const extractObjects = (text: string): string => {
          let depth = 0
          let start = -1

          for (let i = 0; i < text.length; i++) {
            if (text[i] === '{') {
              if (depth === 0) start = i
              depth++
            } else if (text[i] === '}') {
              depth--
              if (depth === 0 && start >= 0) {
                parseAndEmit(text.slice(start, i + 1))
                start = -1
              }
            }
          }

          // Return unparsed remainder (incomplete object)
          if (start >= 0) return text.slice(start)
          return ''
        }

        res.on('data', (chunk: Buffer) => {
          buffer += chunk.toString()
          buffer = extractObjects(buffer)
        })

        res.on('end', () => {
          if (buffer.trim()) {
            extractObjects(buffer)
          }
          writeSSE(httpStream, { type: 'done' })
          resolve()
        })

        res.on('error', () => {
          writeSSE(httpStream, { type: 'error', content: 'Agent stream interrupted' })
          resolve()
        })
      }
    )

    req.on('error', () => {
      writeSSE(httpStream, { type: 'error', content: 'Agent service unavailable' })
      resolve()
    })

    req.setTimeout(110_000, () => {
      req.destroy()
      writeSSE(httpStream, { type: 'error', content: 'Agent request timed out' })
      resolve()
    })

    req.write(postData)
    req.end()
  })
}

export const handler = awslambda.streamifyResponse(async (event: StreamEvent, responseStream) => {
  const httpStream = awslambda.HttpResponseStream.from(responseStream, { statusCode: 200, headers: HEADERS })

  let body: { message?: string; conversationHistory?: ConversationTurn[] } = {}
  try { body = event.body ? JSON.parse(event.body) : {} } catch { /* ignore */ }

  if (!body.message) {
    writeSSE(httpStream, { type: 'error', content: 'Missing message field' })
    ;(httpStream as unknown as Writable).end()
    return
  }

  // Extract user info from JWT
  const user = extractUserObjectFromEvent(event as unknown as APIGatewayProxyEvent)
  if (!user) {
    writeSSE(httpStream, { type: 'error', content: 'Authentication required' })
    ;(httpStream as unknown as Writable).end()
    return
  }

  // Extract project ID from header
  const projectId = extractProjectFromEvent(event as unknown as APIGatewayProxyEvent)
  if (!projectId) {
    writeSSE(httpStream, { type: 'error', content: 'Project ID required' })
    ;(httpStream as unknown as Writable).end()
    return
  }

  try {
    // Fetch user data from DynamoDB
    const data = await fetchUserData(projectId, user.sub)

    // Build system prompt with user context
    const userName = user.given_name || user.name || user.email || 'there'
    const systemPrompt = buildSystemPrompt(userName, data)

    // Stream response from EC2 agent
    await streamFromEC2(
      body.message,
      systemPrompt,
      body.conversationHistory ?? [],
      httpStream
    )
  } catch (err) {
    console.error('Stream agent error:', err)
    writeSSE(httpStream, { type: 'error', content: 'An unexpected error occurred' })
  }

  ;(httpStream as unknown as Writable).end()
})

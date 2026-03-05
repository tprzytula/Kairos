/// <reference path="./awslambda.d.ts" />
import { Writable } from 'stream'

interface StreamEvent {
  headers?: Record<string, string>
  body?: string
}

const HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

const writeSSE = (stream: NodeJS.WritableStream, data: unknown) => {
  stream.write(`data: ${JSON.stringify(data)}\n\n`)
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const handler = awslambda.streamifyResponse(async (event: StreamEvent, responseStream) => {
  const httpStream = awslambda.HttpResponseStream.from(responseStream, { statusCode: 200, headers: HEADERS })

  let body: { message?: string } = {}
  try { body = event.body ? JSON.parse(event.body) : {} } catch { /* ignore */ }

  if (!body.message) {
    writeSSE(httpStream, { type: 'error', content: 'Missing message field' })
    ;(httpStream as unknown as Writable).end()
    return
  }

  writeSSE(httpStream, { type: 'message', content: body.message })

  for (let i = 1; i <= 5; i++) {
    await sleep(1000)
    writeSSE(httpStream, { type: 'timestamp', index: i, content: new Date().toISOString() })
  }

  writeSSE(httpStream, { type: 'done' })
  ;(httpStream as unknown as Writable).end()
})

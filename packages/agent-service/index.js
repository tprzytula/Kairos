const http = require('http')
const { spawn } = require('child_process')

const PORT = 3001
const SECRET = process.env.AGENT_SECRET

if (!SECRET) {
  console.error('AGENT_SECRET environment variable is required')
  process.exit(1)
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (req.method === 'POST' && req.url === '/stream') {
    const auth = req.headers.authorization
    if (!auth || auth !== `Bearer ${SECRET}`) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Unauthorized' }))
      return
    }

    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      let parsed
      try {
        parsed = JSON.parse(body)
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
        return
      }

      const { message, systemPrompt, conversationHistory } = parsed
      if (!message) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Missing message field' }))
        return
      }

      // Build the full prompt including conversation history
      let fullPrompt = ''
      if (conversationHistory && conversationHistory.length > 0) {
        for (const turn of conversationHistory) {
          const role = turn.role === 'user' ? 'Human' : 'Assistant'
          fullPrompt += `${role}: ${turn.content}\n\n`
        }
      }
      fullPrompt += `Human: ${message}\n\nAssistant:`

      const args = [
        '-p', fullPrompt,
        '--output-format', 'stream-json',
      ]
      if (systemPrompt) {
        args.push('--system-prompt', systemPrompt)
      }

      const claude = spawn('claude', args, {
        env: { ...process.env, HOME: '/home/ec2-user' },
      })

      res.writeHead(200, {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      })

      claude.stdout.on('data', chunk => {
        res.write(chunk)
      })

      claude.stderr.on('data', chunk => {
        console.error('claude stderr:', chunk.toString())
      })

      claude.on('close', code => {
        if (code !== 0) {
          console.error(`claude process exited with code ${code}`)
        }
        res.end()
      })

      claude.on('error', err => {
        console.error('Failed to spawn claude:', err)
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
        }
        res.end(JSON.stringify({ error: 'Failed to start agent' }))
      })

      // Kill claude process if client disconnects
      req.on('close', () => {
        if (!claude.killed) {
          claude.kill('SIGTERM')
        }
      })
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Kairos agent service listening on port ${PORT}`)
})

#!/bin/bash
set -e

# Install Node.js 20
dnf install -y nodejs20

# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Create service directory
mkdir -p /home/ec2-user/agent-service

# Write .env
cat > /home/ec2-user/agent-service/.env << 'ENVEOF'
AGENT_SECRET=${agent_secret}
ENVEOF

# Write index.js
cat > /home/ec2-user/agent-service/index.js << 'JSEOF'
const http = require('http')
const { spawn } = require('child_process')

const PORT = 3001
const SECRET = process.env.AGENT_SECRET
const MAX_REQUESTS_PER_MINUTE = 10
const MAX_PROCESS_DURATION_MS = 2 * 60 * 1000

if (!SECRET) {
  console.error('AGENT_SECRET environment variable is required')
  process.exit(1)
}

// --- Rate limiting ---
const requestCounts = new Map()

setInterval(() => requestCounts.clear(), 60000)

const isRateLimited = (ip) => {
  const count = requestCounts.get(ip) ?? 0
  if (count >= MAX_REQUESTS_PER_MINUTE) return true
  requestCounts.set(ip, count + 1)
  return false
}

// --- Concurrency control ---
let activeProcess = null

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (req.method === 'POST' && req.url === '/stream') {
    const auth = req.headers.authorization
    if (!auth || auth !== `Bearer $${SECRET}`) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Unauthorized' }))
      return
    }

    const ip = req.socket.remoteAddress
    if (isRateLimited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Too many requests' }))
      return
    }

    if (activeProcess) {
      res.writeHead(503, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Agent is busy, try again shortly' }))
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
          fullPrompt += `$${role}: $${turn.content}\n\n`
        }
      }
      fullPrompt += `Human: $${message}\n\nAssistant:`

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

      activeProcess = claude

      // Auto-kill if process runs too long
      const timeout = setTimeout(() => {
        if (!claude.killed) {
          console.error('Claude process exceeded max duration, killing')
          claude.kill('SIGTERM')
        }
      }, MAX_PROCESS_DURATION_MS)

      const cleanup = () => {
        clearTimeout(timeout)
        if (activeProcess === claude) activeProcess = null
      }

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
        cleanup()
        if (code !== 0) {
          console.error(`claude process exited with code $${code}`)
        }
        res.end()
      })

      claude.on('error', err => {
        cleanup()
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
  console.log(`Kairos agent service listening on port $${PORT}`)
})
JSEOF

# Set ownership
chown -R ec2-user:ec2-user /home/ec2-user/agent-service

# Install systemd service
cat > /etc/systemd/system/kairos-agent.service << 'SVCEOF'
[Unit]
Description=Kairos Agent Service
After=network.target

[Service]
Type=simple
User=ec2-user
EnvironmentFile=/home/ec2-user/agent-service/.env
WorkingDirectory=/home/ec2-user/agent-service
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable kairos-agent

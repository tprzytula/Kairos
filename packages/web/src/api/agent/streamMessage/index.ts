export interface StreamChunk {
  type: 'message' | 'timestamp' | 'done' | 'error'
  content?: string
  index?: number
}

export const streamAgentMessage = async (
  message: string,
  accessToken: string | undefined,
  onChunk: (chunk: StreamChunk) => void,
  signal?: AbortSignal
): Promise<void> => {
  const response = await fetch('/agent/stream', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok || !response.body) throw new Error(`Stream failed: ${response.status}`)

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''
      for (const event of events) {
        const line = event.split('\n').find(l => l.startsWith('data: '))
        if (!line) continue
        try {
          const chunk = JSON.parse(line.slice(6)) as StreamChunk
          onChunk(chunk)
          if (chunk.type === 'done') return
        } catch { /* malformed line */ }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

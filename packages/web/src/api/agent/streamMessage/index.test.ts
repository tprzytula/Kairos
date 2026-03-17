import { streamAgentMessage } from '.'
import { TextDecoder, TextEncoder } from 'util'

// Polyfill Web APIs missing from JSDOM
Object.assign(global, { TextDecoder, TextEncoder })

// JSDOM does not implement ReadableStream, so we build a lightweight mock reader
// that yields pre-encoded SSE chunks one at a time.
function makeMockBody(sseChunks: string[]) {
  const encoder = new TextEncoder()
  const encoded = sseChunks.map(c => encoder.encode(c))
  let index = 0
  const reader = {
    read: jest.fn(async () => {
      if (index < encoded.length) {
        return { done: false, value: encoded[index++] }
      }
      return { done: true, value: undefined }
    }),
    releaseLock: jest.fn(),
  }
  return { getReader: () => reader, _reader: reader }
}

describe('Given the streamAgentMessage function', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should POST to /agent/stream with Authorization and X-Project-ID headers', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: makeMockBody(['data: {"type":"done"}\n\n']),
    } as any)

    await streamAgentMessage('Hello', 'access-token-123', jest.fn(), undefined, [], 'test-project-id')

    expect(fetchSpy).toHaveBeenCalledWith('/agent/stream', {
      method: 'POST',
      signal: undefined,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer access-token-123',
        'X-Project-ID': 'test-project-id',
      },
      body: JSON.stringify({ message: 'Hello', conversationHistory: [] }),
    })
  })

  it('should omit Authorization header when no accessToken is provided', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: makeMockBody(['data: {"type":"done"}\n\n']),
    } as any)

    await streamAgentMessage('Hello', undefined, jest.fn(), undefined, [])

    expect(fetchSpy).toHaveBeenCalledWith('/agent/stream', expect.objectContaining({
      headers: { 'Content-Type': 'application/json' },
    }))
  })

  it('should omit X-Project-ID header when no projectId is provided', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: makeMockBody(['data: {"type":"done"}\n\n']),
    } as any)

    await streamAgentMessage('Hello', 'token', jest.fn(), undefined, [])

    expect(fetchSpy).toHaveBeenCalledWith('/agent/stream', expect.objectContaining({
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    }))
  })

  it('should call onChunk for each text_delta event', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: makeMockBody([
        'data: {"type":"text_delta","content":"Hello"}\n\n',
        'data: {"type":"text_delta","content":" world"}\n\n',
        'data: {"type":"done"}\n\n',
      ]),
    } as any)

    const onChunk = jest.fn()
    await streamAgentMessage('Hi', 'token', onChunk)

    expect(onChunk).toHaveBeenCalledWith({ type: 'text_delta', content: 'Hello' })
    expect(onChunk).toHaveBeenCalledWith({ type: 'text_delta', content: ' world' })
  })

  it('should stop processing after receiving a done chunk', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: makeMockBody([
        'data: {"type":"done"}\n\ndata: {"type":"text_delta","content":"after done"}\n\n',
      ]),
    } as any)

    const onChunk = jest.fn()
    await streamAgentMessage('Hi', 'token', onChunk)

    expect(onChunk).not.toHaveBeenCalledWith(expect.objectContaining({ content: 'after done' }))
  })

  it('should call onChunk with an error chunk on an error event', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: makeMockBody([
        'data: {"type":"error","content":"Something went wrong"}\n\n',
        'data: {"type":"done"}\n\n',
      ]),
    } as any)

    const onChunk = jest.fn()
    await streamAgentMessage('Hi', 'token', onChunk)

    expect(onChunk).toHaveBeenCalledWith({ type: 'error', content: 'Something went wrong' })
  })

  it('should throw when response status is not ok', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      body: null,
    } as any)

    await expect(streamAgentMessage('Hi', 'token', jest.fn())).rejects.toThrow('Stream failed: 500')
  })

  it('should release the reader lock after streaming completes', async () => {
    const mockBody = makeMockBody(['data: {"type":"done"}\n\n'])
    const reader = mockBody._reader
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200, body: mockBody } as any)

    await streamAgentMessage('Hi', 'token', jest.fn())

    expect(reader.releaseLock).toHaveBeenCalled()
  })

  it('should release the reader lock even when an error is thrown mid-stream', async () => {
    const encoder = new TextEncoder()
    let calls = 0
    const reader = {
      read: jest.fn(async () => {
        if (calls++ === 0) return { done: false, value: encoder.encode('data: {"type":"text_delta","content":"hi"}\n\n') }
        throw new Error('stream interrupted')
      }),
      releaseLock: jest.fn(),
    }
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true, status: 200, body: { getReader: () => reader },
    } as any)

    await expect(streamAgentMessage('Hi', 'token', jest.fn())).rejects.toThrow('stream interrupted')
    expect(reader.releaseLock).toHaveBeenCalled()
  })
})

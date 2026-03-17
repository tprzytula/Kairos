import { renderHook, act, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { AgentChatProvider, useAgentChatContext } from './index'
import { streamAgentMessage } from '../../api/agent/streamMessage'
import { useAuth } from 'react-oidc-context'
import { useProjectContext } from '../ProjectProvider/ProjectProvider'

jest.mock('../../api/agent/streamMessage', () => ({
  streamAgentMessage: jest.fn(),
}))

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../ProjectProvider/ProjectProvider', () => ({
  useProjectContext: jest.fn(),
}))

const mockStreamAgentMessage = streamAgentMessage as jest.Mock
const mockUseAuth = useAuth as jest.Mock
const mockUseProjectContext = useProjectContext as jest.Mock

const Wrapper = ({ children }: { children: ReactNode }) => (
  <AgentChatProvider>{children}</AgentChatProvider>
)

describe('Given the AgentChatProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseAuth.mockReturnValue({
      user: { access_token: 'test-access-token' },
    })

    mockUseProjectContext.mockReturnValue({
      currentProject: { id: 'project-1', name: 'Test Project' },
    })

    mockStreamAgentMessage.mockResolvedValue(undefined)
  })

  describe('When openChat is called', () => {
    it('should set isOpen to true', () => {
      const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

      expect(result.current.isOpen).toBe(false)

      act(() => {
        result.current.openChat()
      })

      expect(result.current.isOpen).toBe(true)
    })
  })

  describe('When closeChat is called', () => {
    it('should set isOpen to false', () => {
      const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

      act(() => {
        result.current.openChat()
      })

      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.closeChat()
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should abort any in-progress stream', async () => {
      let capturedSignal: AbortSignal | undefined

      mockStreamAgentMessage.mockImplementation(
        async (_msg: string, _token: string, _onChunk: unknown, signal: AbortSignal) => {
          capturedSignal = signal
          await new Promise(() => {}) // never resolves - simulates long-running stream
        }
      )

      const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

      act(() => {
        result.current.openChat()
      })

      // Start a message without awaiting so the stream stays in-flight
      act(() => {
        result.current.sendMessage('Hello')
      })

      await waitFor(() => {
        expect(capturedSignal).toBeDefined()
      })

      act(() => {
        result.current.closeChat()
      })

      expect(capturedSignal!.aborted).toBe(true)
    })
  })

  describe('When sendMessage is called', () => {
    it('should add a user message to messages', async () => {
      mockStreamAgentMessage.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

      await act(async () => {
        await result.current.sendMessage('Hello there')
      })

      const userMessage = result.current.messages.find(m => m.role === 'user')
      expect(userMessage).toBeDefined()
      expect(userMessage!.content).toBe('Hello there')
    })

    it('should add an agent message placeholder with isStreaming initially true before the stream resolves', async () => {
      let resolveStream!: () => void
      const streamPromise = new Promise<void>(resolve => { resolveStream = resolve })

      mockStreamAgentMessage.mockReturnValue(streamPromise)

      const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

      // Kick off sendMessage without awaiting so we can inspect mid-flight state
      act(() => {
        result.current.sendMessage('Hello')
      })

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2)
      })

      const agentMessage = result.current.messages.find(m => m.role === 'agent')
      expect(agentMessage).toBeDefined()
      expect(agentMessage!.isStreaming).toBe(true)

      // Clean up - resolve the stream so the hook can settle
      act(() => {
        resolveStream()
      })

      await waitFor(() => {
        expect(result.current.isTyping).toBe(false)
      })
    })

    it('should call streamAgentMessage with correct arguments', async () => {
      const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

      await act(async () => {
        await result.current.sendMessage('Test message')
      })

      expect(mockStreamAgentMessage).toHaveBeenCalledWith(
        'Test message',
        'test-access-token',
        expect.any(Function),
        expect.any(AbortSignal),
        [],
        'project-1'
      )
    })

    describe('When a text_delta chunk arrives', () => {
      it('should append the chunk content to the agent message and set isTyping to false', async () => {
        mockStreamAgentMessage.mockImplementation(
          async (_msg: string, _token: string, onChunk: (chunk: { type: string; content?: string }) => void) => {
            onChunk({ type: 'text_delta', content: 'Hello' })
            onChunk({ type: 'text_delta', content: ' world' })
          }
        )

        const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

        await act(async () => {
          await result.current.sendMessage('Hi')
        })

        const agentMessage = result.current.messages.find(m => m.role === 'agent')
        expect(agentMessage!.content).toBe('Hello world')
        expect(result.current.isTyping).toBe(false)
      })
    })

    describe('When a done chunk arrives', () => {
      it('should set agent message isStreaming to false', async () => {
        mockStreamAgentMessage.mockImplementation(
          async (_msg: string, _token: string, onChunk: (chunk: { type: string; content?: string }) => void) => {
            onChunk({ type: 'text_delta', content: 'Response' })
            onChunk({ type: 'done' })
          }
        )

        const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

        await act(async () => {
          await result.current.sendMessage('Hi')
        })

        const agentMessage = result.current.messages.find(m => m.role === 'agent')
        expect(agentMessage!.isStreaming).toBe(false)
      })
    })

    describe('When an error chunk arrives', () => {
      it('should set the agent message content to the chunk content', async () => {
        mockStreamAgentMessage.mockImplementation(
          async (_msg: string, _token: string, onChunk: (chunk: { type: string; content?: string }) => void) => {
            onChunk({ type: 'error', content: 'Service unavailable' })
          }
        )

        const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

        await act(async () => {
          await result.current.sendMessage('Hi')
        })

        const agentMessage = result.current.messages.find(m => m.role === 'agent')
        expect(agentMessage!.content).toBe('Service unavailable')
      })

      it('should set the agent message content to the fallback when chunk has no content', async () => {
        mockStreamAgentMessage.mockImplementation(
          async (_msg: string, _token: string, onChunk: (chunk: { type: string; content?: string }) => void) => {
            onChunk({ type: 'error' })
          }
        )

        const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

        await act(async () => {
          await result.current.sendMessage('Hi')
        })

        const agentMessage = result.current.messages.find(m => m.role === 'agent')
        expect(agentMessage!.content).toBe('Something went wrong.')
      })
    })

    describe('When streamAgentMessage throws a non-abort error', () => {
      it('should set the agent message content to the failure message', async () => {
        mockStreamAgentMessage.mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

        await act(async () => {
          await result.current.sendMessage('Hi')
        })

        const agentMessage = result.current.messages.find(m => m.role === 'agent')
        expect(agentMessage!.content).toBe('Failed to get a response.')
        expect(result.current.isTyping).toBe(false)
      })
    })

    describe('When streamAgentMessage throws an AbortError', () => {
      it('should retain the agent message last content without overwriting it', async () => {
        mockStreamAgentMessage.mockImplementation(
          async (_msg: string, _token: string, onChunk: (chunk: { type: string; content?: string }) => void) => {
            onChunk({ type: 'text_delta', content: 'Partial' })
            const abortError = new Error('Aborted')
            abortError.name = 'AbortError'
            throw abortError
          }
        )

        const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

        await act(async () => {
          await result.current.sendMessage('Hi')
        })

        const agentMessage = result.current.messages.find(m => m.role === 'agent')
        expect(agentMessage!.content).toBe('Partial')
      })

      it('should set isTyping to false after an AbortError', async () => {
        mockStreamAgentMessage.mockImplementation(async () => {
          const abortError = new Error('Aborted')
          abortError.name = 'AbortError'
          throw abortError
        })

        const { result } = renderHook(() => useAgentChatContext(), { wrapper: Wrapper })

        await act(async () => {
          await result.current.sendMessage('Hi')
        })

        expect(result.current.isTyping).toBe(false)
      })
    })
  })
})

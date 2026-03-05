import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'
import { useAuth } from 'react-oidc-context'
import { IState, IAgentChatProviderProps, IChatMessage } from './types'
import { streamAgentMessage } from '../../api/agent/streamMessage'

export const initialState: IState = {
  messages: [],
  isOpen: false,
  isTyping: false,
  openChat: () => {},
  closeChat: () => {},
  sendMessage: async () => {},
}

export const AgentChatContext = createContext<IState>(initialState)

export const useAgentChatContext = () => useContext(AgentChatContext)

export const AgentChatProvider = ({ children }: IAgentChatProviderProps) => {
  const auth = useAuth()
  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const openChat = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsOpen(false)
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: IChatMessage = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      role: 'user',
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    const agentMessageId = crypto.randomUUID()
    const agentMessage: IChatMessage = {
      id: agentMessageId,
      content: '',
      timestamp: new Date(),
      role: 'agent',
      isStreaming: true,
    }
    setMessages((prev) => [...prev, agentMessage])

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      await streamAgentMessage(
        content,
        auth.user?.access_token,
        (chunk) => {
          if (chunk.type === 'message' || chunk.type === 'timestamp') {
            setIsTyping(false)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === agentMessageId
                  ? {
                      ...msg,
                      content: chunk.type === 'message'
                        ? (chunk.content ?? '')
                        : msg.content + '\n' + (chunk.content ?? ''),
                    }
                  : msg
              )
            )
          } else if (chunk.type === 'done') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === agentMessageId ? { ...msg, isStreaming: false } : msg
              )
            )
          }
        },
        controller.signal
      )
    } catch (err) {
      const isAbort = err instanceof Error && err.name === 'AbortError'
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMessageId
            ? {
                ...msg,
                isStreaming: false,
                content: isAbort ? msg.content : 'Failed to get a response.',
              }
            : msg
        )
      )
    } finally {
      setIsTyping(false)
    }
  }, [auth.user?.access_token])

  const value = useMemo(
    () => ({
      messages,
      isOpen,
      isTyping,
      openChat,
      closeChat,
      sendMessage,
    }),
    [messages, isOpen, isTyping, openChat, closeChat, sendMessage]
  )

  return <AgentChatContext.Provider value={value}>{children}</AgentChatContext.Provider>
}

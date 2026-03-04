import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useAuth } from 'react-oidc-context'
import { IState, IAgentChatProviderProps, IChatMessage } from './types'
import { sendAgentMessage } from '../../api/agent/sendMessage'

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

  const openChat = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeChat = useCallback(() => {
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

    try {
      const reply = await sendAgentMessage(content, auth.user?.access_token)
      const agentMessage: IChatMessage = {
        id: crypto.randomUUID(),
        content: reply.message,
        timestamp: new Date(),
        role: 'agent',
      }
      setMessages((prev) => [...prev, agentMessage])
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

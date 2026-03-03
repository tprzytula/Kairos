import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { IState, IAgentChatProviderProps, IChatMessage } from './types'

export const initialState: IState = {
  messages: [],
  isOpen: false,
  openChat: () => {},
  closeChat: () => {},
  sendMessage: () => {},
}

export const AgentChatContext = createContext<IState>(initialState)

export const useAgentChatContext = () => useContext(AgentChatContext)

export const AgentChatProvider = ({ children }: IAgentChatProviderProps) => {
  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const openChat = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  const sendMessage = useCallback((content: string) => {
    const message: IChatMessage = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      role: 'user',
    }
    setMessages((prev) => [...prev, message])
  }, [])

  const value = useMemo(
    () => ({
      messages,
      isOpen,
      openChat,
      closeChat,
      sendMessage,
    }),
    [messages, isOpen, openChat, closeChat, sendMessage]
  )

  return <AgentChatContext.Provider value={value}>{children}</AgentChatContext.Provider>
}

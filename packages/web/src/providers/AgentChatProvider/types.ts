import { ReactNode } from 'react'

export interface IChatMessage {
  id: string
  content: string
  timestamp: Date
  role: 'user' | 'agent'
}

export interface IState {
  messages: IChatMessage[]
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  sendMessage: (content: string) => Promise<void>
}

export interface IAgentChatProviderProps {
  children: ReactNode
}

import { ReactNode } from 'react'

export interface IChatMessage {
  id: string
  content: string
  timestamp: Date
  role: 'user'
}

export interface IState {
  messages: IChatMessage[]
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  sendMessage: (content: string) => void
}

export interface IAgentChatProviderProps {
  children: ReactNode
}

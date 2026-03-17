import { useEffect, useRef } from 'react'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { useAgentChatContext } from '../../providers/AgentChatProvider'
import ChatMessageBubble from './components/ChatMessageBubble'
import ChatEmptyState from './components/ChatEmptyState'
import ChatInput from './components/ChatInput'
import TypingIndicator from './components/TypingIndicator'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  StatusRow,
  StatusDot,
  StatusLabel,
  MessageList,
} from './index.styled'

const AgentChatDrawer = () => {
  const { isOpen, closeChat, messages, sendMessage, isTyping } = useAgentChatContext()
  const hasStreamingBubble = messages.some((m) => m.role === 'agent' && m.isStreaming)
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  return (
    <DraggableBottomDrawer
      open={isOpen}
      onClose={closeChat}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      contentSx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox>
              <SmartToyOutlinedIcon />
            </DrawerIconBox>
            <div>
              <DrawerTitle>Agent</DrawerTitle>
              <StatusRow>
                <StatusDot />
                <StatusLabel>Connected</StatusLabel>
              </StatusRow>
            </div>
          </DrawerHeaderLeft>
        </DrawerHeader>
      }
    >
      <MessageList ref={messageListRef} data-testid="message-list">
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          messages.map((message) => <ChatMessageBubble key={message.id} message={message} />)
        )}
        {isTyping && !hasStreamingBubble && <TypingIndicator />}
      </MessageList>

      <ChatInput onSend={sendMessage} />
    </DraggableBottomDrawer>
  )
}

export default AgentChatDrawer

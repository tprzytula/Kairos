import { useEffect, useRef } from 'react'
import { Box, Drawer, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { useAgentChatContext } from '../../providers/AgentChatProvider'
import ChatMessageBubble from './components/ChatMessageBubble'
import ChatEmptyState from './components/ChatEmptyState'
import ChatInput from './components/ChatInput'
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
  const { isOpen, closeChat, messages, sendMessage } = useAgentChatContext()
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={closeChat}
      PaperProps={{
        sx: {
          height: 'calc(100% - env(safe-area-inset-top) - 16px)',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
      }}
    >
      <Box
        sx={{
          width: '36px',
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(0,0,0,0.15)',
          mx: 'auto',
          mt: '10px',
          mb: '2px',
          flexShrink: 0,
        }}
      />
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
        <IconButton onClick={closeChat} aria-label="Close chat" size="small">
          <CloseIcon />
        </IconButton>
      </DrawerHeader>

      <MessageList ref={messageListRef} data-testid="message-list">
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          messages.map((message) => <ChatMessageBubble key={message.id} message={message} />)
        )}
      </MessageList>

      <ChatInput onSend={sendMessage} />
    </Drawer>
  )
}

export default AgentChatDrawer

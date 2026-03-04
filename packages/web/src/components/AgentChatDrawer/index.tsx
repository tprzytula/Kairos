import { useEffect, useRef, useState } from 'react'
import { Box, Drawer } from '@mui/material'
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

const DRAG_CLOSE_THRESHOLD = 100

const AgentChatDrawer = () => {
  const { isOpen, closeChat, messages, sendMessage } = useAgentChatContext()
  const messageListRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const isDragging = useRef(false)
  const dragStartY = useRef(0)
  const dragOffsetRef = useRef(0)

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const handle = dragHandleRef.current
    if (!handle) return

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      dragStartY.current = e.clientY
      handle.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const offset = Math.max(0, e.clientY - dragStartY.current)
      dragOffsetRef.current = offset
      setDragOffset(offset)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging.current) {
        const finalOffset = Math.max(0, e.clientY - dragStartY.current)
        if (finalOffset >= DRAG_CLOSE_THRESHOLD) {
          closeChat()
        }
      }
      isDragging.current = false
      dragOffsetRef.current = 0
      setDragOffset(0)
    }

    handle.addEventListener('pointerdown', onPointerDown)
    handle.addEventListener('pointermove', onPointerMove)
    handle.addEventListener('pointerup', onPointerUp)

    return () => {
      handle.removeEventListener('pointerdown', onPointerDown)
      handle.removeEventListener('pointermove', onPointerMove)
      handle.removeEventListener('pointerup', onPointerUp)
    }
  }, [closeChat])

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={closeChat}
      transitionDuration={{ enter: 350, exit: 300 }}
      PaperProps={{
        sx: {
          height: 'calc(100% - env(safe-area-inset-top) - 16px)',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: 'env(safe-area-inset-bottom)',
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging.current
            ? 'transform 0s'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
    >
      <Box
        ref={dragHandleRef}
        role="button"
        aria-label="Drag to close"
        sx={{
          width: '100%',
          flexShrink: 0,
          cursor: 'grab',
          touchAction: 'none',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            pt: '10px',
            pb: '2px',
          }}
        >
          <Box
            sx={{
              width: '36px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(0,0,0,0.15)',
            }}
          />
        </Box>
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
      </Box>

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

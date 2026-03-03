import { useState, KeyboardEvent } from 'react'
import { TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { IChatInputProps } from './types'
import { ChatInputContainer, SendButton } from './index.styled'

const ChatInput = ({ onSend }: IChatInputProps) => {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isActive = value.trim().length > 0

  return (
    <ChatInputContainer>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Message agent…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            fontSize: '0.9rem',
          },
        }}
      />
      <SendButton
        active={isActive ? 'true' : 'false'}
        disabled={!isActive}
        onClick={handleSend}
        aria-label="Send message"
      >
        <SendIcon />
      </SendButton>
    </ChatInputContainer>
  )
}

export default ChatInput

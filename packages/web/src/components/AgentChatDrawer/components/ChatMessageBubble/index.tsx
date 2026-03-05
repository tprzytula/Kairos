import { Box } from '@mui/material'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { IChatMessageBubbleProps } from './types'
import { BubbleWrapper, BubbleRow, AgentAvatar, Bubble, BubbleTimestamp } from './index.styled'
import { Dot } from '../TypingIndicator/index.styled'

const ChatMessageBubble = ({ message }: IChatMessageBubbleProps) => {
  const isAgent = message.role === 'agent'
  const timeLabel = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const showDots = isAgent && message.isStreaming && !message.content

  return (
    <BubbleWrapper isAgent={isAgent}>
      <BubbleRow isAgent={isAgent}>
        {isAgent && (
          <AgentAvatar>
            <SmartToyOutlinedIcon sx={{ fontSize: '16px' }} />
          </AgentAvatar>
        )}
        <Bubble isAgent={isAgent}>
          {showDots ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Dot delay={0} />
              <Dot delay={200} />
              <Dot delay={400} />
            </Box>
          ) : (
            message.content
          )}
        </Bubble>
      </BubbleRow>
      <BubbleTimestamp isAgent={isAgent}>{timeLabel}</BubbleTimestamp>
    </BubbleWrapper>
  )
}

export default ChatMessageBubble

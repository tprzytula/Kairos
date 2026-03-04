import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { IChatMessageBubbleProps } from './types'
import { BubbleWrapper, BubbleRow, AgentAvatar, Bubble, BubbleTimestamp } from './index.styled'

const ChatMessageBubble = ({ message }: IChatMessageBubbleProps) => {
  const isAgent = message.role === 'agent'
  const timeLabel = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <BubbleWrapper isAgent={isAgent}>
      <BubbleRow isAgent={isAgent}>
        {isAgent && (
          <AgentAvatar>
            <SmartToyOutlinedIcon sx={{ fontSize: '16px' }} />
          </AgentAvatar>
        )}
        <Bubble isAgent={isAgent}>{message.content}</Bubble>
      </BubbleRow>
      <BubbleTimestamp isAgent={isAgent}>{timeLabel}</BubbleTimestamp>
    </BubbleWrapper>
  )
}

export default ChatMessageBubble

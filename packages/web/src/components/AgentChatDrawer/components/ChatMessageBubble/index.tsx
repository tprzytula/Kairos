import { IChatMessageBubbleProps } from './types'
import { BubbleWrapper, Bubble, BubbleTimestamp } from './index.styled'

const ChatMessageBubble = ({ message }: IChatMessageBubbleProps) => {
  const timeLabel = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <BubbleWrapper>
      <Bubble>{message.content}</Bubble>
      <BubbleTimestamp>{timeLabel}</BubbleTimestamp>
    </BubbleWrapper>
  )
}

export default ChatMessageBubble

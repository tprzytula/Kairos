import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { EmptyStateContainer, EmptyIconBox, EmptyHeading, EmptySubtext } from './index.styled'

const ChatEmptyState = () => {
  return (
    <EmptyStateContainer>
      <EmptyIconBox>
        <ChatBubbleOutlineIcon />
      </EmptyIconBox>
      <EmptyHeading>No messages yet</EmptyHeading>
      <EmptySubtext>Send a message to start a conversation with the agent running on your machine.</EmptySubtext>
    </EmptyStateContainer>
  )
}

export default ChatEmptyState

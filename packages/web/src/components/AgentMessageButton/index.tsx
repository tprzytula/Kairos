import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { useAgentChatContext } from '../../providers/AgentChatProvider'
import {
  AgentMessageButtonContainer,
  AgentMessageCard,
  AgentMessageLeft,
  AgentIconBox,
  AgentMessageLabel,
  AgentMessageRight,
  MessageCountBadge,
} from './index.styled'

const AgentMessageButton = () => {
  const { openChat, messages } = useAgentChatContext()
  const messageCount = messages.length

  return (
    <AgentMessageButtonContainer>
      <AgentMessageCard onClick={openChat} data-testid="agent-message-button">
        <AgentMessageLeft>
          <AgentIconBox>
            <SmartToyOutlinedIcon />
          </AgentIconBox>
          <AgentMessageLabel>Message Agent</AgentMessageLabel>
        </AgentMessageLeft>
        <AgentMessageRight>
          {messageCount > 0 && (
            <MessageCountBadge data-testid="message-count-badge">{messageCount}</MessageCountBadge>
          )}
          <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
        </AgentMessageRight>
      </AgentMessageCard>
    </AgentMessageButtonContainer>
  )
}

export default AgentMessageButton

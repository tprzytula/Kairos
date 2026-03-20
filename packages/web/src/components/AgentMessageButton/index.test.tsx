import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AgentMessageButton from './index'
import { AgentChatContext } from '../../providers/AgentChatProvider'
import { IState } from '../../providers/AgentChatProvider/types'

const theme = createTheme()

const renderWithContext = (contextValue: Partial<IState> = {}) => {
  const defaultValue: IState = {
    messages: [],
    isOpen: false,
    isTyping: false,
    openChat: vi.fn(),
    closeChat: vi.fn(),
    sendMessage: vi.fn(),
    ...contextValue,
  }

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <AgentChatContext.Provider value={defaultValue}>
          <AgentMessageButton />
        </AgentChatContext.Provider>
      </ThemeProvider>
    ),
    contextValue: defaultValue,
  }
}

describe('Given the AgentMessageButton component', () => {
  it('should render the button', () => {
    renderWithContext()
    expect(screen.getByTestId('agent-message-button')).toBeInTheDocument()
  })

  it('should display the "Message Agent" label', () => {
    renderWithContext()
    expect(screen.getByText('Message Agent')).toBeInTheDocument()
  })

  describe('When the button is clicked', () => {
    it('should call openChat', () => {
      const openChat = vi.fn()
      renderWithContext({ openChat })

      fireEvent.click(screen.getByTestId('agent-message-button'))

      expect(openChat).toHaveBeenCalledTimes(1)
    })
  })

  describe('When there are no messages', () => {
    it('should not render the message count badge', () => {
      renderWithContext({ messages: [] })
      expect(screen.queryByTestId('message-count-badge')).not.toBeInTheDocument()
    })
  })

  describe('When there are messages', () => {
    it('should render the message count badge with the correct count', () => {
      renderWithContext({
        messages: [
          { id: '1', content: 'Hello', timestamp: new Date(), role: 'user' },
          { id: '2', content: 'World', timestamp: new Date(), role: 'user' },
        ],
      })

      const badge = screen.getByTestId('message-count-badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('2')
    })
  })
})

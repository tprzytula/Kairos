import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AgentChatDrawer from './index'
import { AgentChatContext } from '../../providers/AgentChatProvider'
import { IState, IChatMessage } from '../../providers/AgentChatProvider/types'

const theme = createTheme()

const renderWithContext = (contextValue: Partial<IState> = {}) => {
  const defaultValue: IState = {
    messages: [],
    isOpen: true,
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
          <AgentChatDrawer />
        </AgentChatContext.Provider>
      </ThemeProvider>
    ),
    contextValue: defaultValue,
  }
}

const EXAMPLE_MESSAGES: IChatMessage[] = [
  { id: '1', content: 'Fix the bug', timestamp: new Date('2025-01-08T10:00:00'), role: 'user' },
  { id: '2', content: 'Run the tests', timestamp: new Date('2025-01-08T10:01:00'), role: 'user' },
]

describe('Given the AgentChatDrawer component', () => {
  describe('When the drawer is open', () => {
    it('should render the drawer', () => {
      renderWithContext()
      expect(screen.getByText('Agent')).toBeInTheDocument()
    })

    it('should show the Connected status', () => {
      renderWithContext()
      expect(screen.getByText('Connected')).toBeInTheDocument()
    })

    it('should render the drag handle', () => {
      renderWithContext()
      expect(screen.getByLabelText('Drag to close')).toBeInTheDocument()
    })

    it('should not render a close button', () => {
      renderWithContext()
      expect(screen.queryByLabelText('Close chat')).not.toBeInTheDocument()
    })

    describe('When the backdrop is clicked', () => {
      it('should call closeChat', () => {
        const closeChat = vi.fn()
        renderWithContext({ closeChat })

        // MUI Drawer exposes onClose via the backdrop — verify it is wired to closeChat
        const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement
        if (backdrop) {
          fireEvent.click(backdrop)
          expect(closeChat).toHaveBeenCalledTimes(1)
        }
      })
    })
  })

  describe('When there are no messages', () => {
    it('should display the empty state', () => {
      renderWithContext({ messages: [] })
      expect(screen.getByText('No messages yet')).toBeInTheDocument()
    })
  })

  describe('When there are messages', () => {
    it('should render each message bubble', () => {
      renderWithContext({ messages: EXAMPLE_MESSAGES })

      expect(screen.getByText('Fix the bug')).toBeInTheDocument()
      expect(screen.getByText('Run the tests')).toBeInTheDocument()
    })

    it('should not show the empty state', () => {
      renderWithContext({ messages: EXAMPLE_MESSAGES })
      expect(screen.queryByText('No messages yet')).not.toBeInTheDocument()
    })
  })

  describe('When the user types and sends a message', () => {
    it('should call sendMessage with the message content', () => {
      const sendMessage = vi.fn()
      renderWithContext({ sendMessage })

      const input = screen.getByPlaceholderText('Message agent…')
      fireEvent.change(input, { target: { value: 'Deploy to prod' } })
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: false })

      expect(sendMessage).toHaveBeenCalledWith('Deploy to prod')
    })

    it('should not call sendMessage when Shift+Enter is pressed', () => {
      const sendMessage = vi.fn()
      renderWithContext({ sendMessage })

      const input = screen.getByPlaceholderText('Message agent…')
      fireEvent.change(input, { target: { value: 'Multi\nline' } })
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })

      expect(sendMessage).not.toHaveBeenCalled()
    })

    it('should not call sendMessage when input is empty', () => {
      const sendMessage = vi.fn()
      renderWithContext({ sendMessage })

      const sendBtn = screen.getByLabelText('Send message')
      fireEvent.click(sendBtn)

      expect(sendMessage).not.toHaveBeenCalled()
    })
  })
})

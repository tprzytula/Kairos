import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ProjectInviteDisplay from './index'

const theme = createTheme()

const renderComponent = (props = {}) => {
  const defaultProps = {
    inviteCode: 'ABC123',
    projectName: 'Test Project',
    onCopySuccess: jest.fn(),
    onShareSuccess: jest.fn()
  }

  return render(
    <ThemeProvider theme={theme}>
      <ProjectInviteDisplay {...defaultProps} {...props} />
    </ThemeProvider>
  )
}

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

// Mock Web Share API
const mockShare = jest.fn()
Object.assign(navigator, {
  share: mockShare,
})

describe('ProjectInviteDisplay component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Display and Layout', () => {
    it('should display invite code digits correctly', () => {
      renderComponent()
      
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should display full layout when not compact', () => {
      renderComponent({ compact: false })
      
      expect(screen.getByText('Invite Code')).toBeInTheDocument()
      expect(screen.getByText('Share this code with others to invite them to your project')).toBeInTheDocument()
    })

    it('should display compact layout when compact is true', () => {
      renderComponent({ compact: true })
      
      expect(screen.queryByText('Invite Code')).not.toBeInTheDocument()
      expect(screen.queryByText('Share this code with others to invite them to your project')).not.toBeInTheDocument()
    })

    it('should display copy and share buttons', () => {
      renderComponent()
      
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Share via WhatsApp' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Share via SMS' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Share via Share' })).toBeInTheDocument()
    })

    it('should display 6 invite code digits', () => {
      renderComponent()
      
      // Get all the digit containers by looking for elements that contain single characters
      const digitElements = [
        screen.getByText('A'),
        screen.getByText('B'), 
        screen.getByText('C'),
        screen.getByText('1'),
        screen.getByText('2'),
        screen.getByText('3')
      ]
      expect(digitElements).toHaveLength(6)
    })
  })

  describe('Copy Functionality', () => {
    it('should copy invite code to clipboard when copy button is clicked', async () => {
      const mockWriteText = navigator.clipboard.writeText as jest.Mock
      mockWriteText.mockResolvedValue(undefined)
      
      const onCopySuccess = jest.fn()
      renderComponent({ onCopySuccess })
      
      const copyButton = screen.getByRole('button', { name: 'Copy' })
      await userEvent.click(copyButton)
      
      expect(mockWriteText).toHaveBeenCalledWith('ABC123')
      await waitFor(() => {
        expect(onCopySuccess).toHaveBeenCalled()
      })
    })

    it('should show visual feedback after successful copy', async () => {
      const mockWriteText = navigator.clipboard.writeText as jest.Mock
      mockWriteText.mockResolvedValue(undefined)
      
      renderComponent()
      
      const copyButton = screen.getByRole('button', { name: 'Copy' })
      await userEvent.click(copyButton)
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })

    it('should handle clipboard write failure gracefully', async () => {
      const mockWriteText = navigator.clipboard.writeText as jest.Mock
      mockWriteText.mockRejectedValue(new Error('Clipboard error'))
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      renderComponent()
      
      const copyButton = screen.getByRole('button', { name: 'Copy' })
      await userEvent.click(copyButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('Share Functionality', () => {
    beforeEach(() => {
      delete (window as any).open
      Object.assign(window, { open: jest.fn() })
    })

    it('should have WhatsApp share button', () => {
      renderComponent()
      
      const whatsappButton = screen.getByRole('button', { name: 'Share via WhatsApp' })
      expect(whatsappButton).toBeInTheDocument()
    })

    it('should have SMS share button', () => {
      renderComponent()
      
      const smsButton = screen.getByRole('button', { name: 'Share via SMS' })
      expect(smsButton).toBeInTheDocument()
    })

    it('should have generic share button', () => {
      renderComponent()
      
      const shareButton = screen.getByRole('button', { name: 'Share via Share' })
      expect(shareButton).toBeInTheDocument()
    })

    it('should open share URL when share buttons are clicked', async () => {
      const mockOpen = jest.fn()
      Object.assign(window, { open: mockOpen })
      
      renderComponent()
      
      const whatsappButton = screen.getByRole('button', { name: 'Share via WhatsApp' })
      await userEvent.click(whatsappButton)
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/'),
        '_blank'
      )
    })

    it('should use native share API when available', async () => {
      mockShare.mockResolvedValue(undefined)
      const onShareSuccess = jest.fn()
      
      renderComponent({ onShareSuccess })
      
      const shareButton = screen.getByRole('button', { name: 'Share via Share' })
      await userEvent.click(shareButton)
      
      expect(mockShare).toHaveBeenCalledWith({
        title: 'Join my Test Project project',
        text: 'Join my "Test Project" project on Kairos! Use invite code: ABC123',
      })
    })
  })

  describe('Different Invite Codes', () => {
    it('should handle different length invite codes', () => {
      renderComponent({ inviteCode: 'ABCD12' })
      
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
      expect(screen.getByText('D')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should handle numeric invite codes', () => {
      renderComponent({ inviteCode: '123456' })
      
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('6')).toBeInTheDocument()
    })

    it('should handle mixed case invite codes by converting to uppercase', () => {
      renderComponent({ inviteCode: 'aBc123' })
      
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  describe('Props handling', () => {
    it('should work without optional callbacks', async () => {
      const mockWriteText = navigator.clipboard.writeText as jest.Mock
      mockWriteText.mockResolvedValue(undefined)
      
      renderComponent({ onCopySuccess: undefined, onShareSuccess: undefined })
      
      const copyButton = screen.getByRole('button', { name: 'Copy' })
      await userEvent.click(copyButton)
      
      expect(mockWriteText).toHaveBeenCalledWith('ABC123')
    })

    it('should handle undefined invite code gracefully', () => {
      const { container } = renderComponent({ inviteCode: undefined })
      
      // Should render nothing when invite code is undefined
      expect(container.firstChild).toBeNull()
    })

    it('should handle empty invite code', () => {
      renderComponent({ inviteCode: '' })
      
      // Should still render the component structure but no digits
      expect(screen.getByText('Invite Code')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    })

    it('should render with different project name', () => {
      renderComponent({ projectName: 'Family Project' })
      
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    })

    it('should render with different invite code', () => {
      renderComponent({ inviteCode: 'XYZ789' })
      
      expect(screen.getByText('X')).toBeInTheDocument()
      expect(screen.getByText('Y')).toBeInTheDocument()
      expect(screen.getByText('Z')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
      expect(screen.getByText('9')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button titles for screen readers', () => {
      renderComponent()
      
      expect(screen.getByRole('button', { name: 'Share via WhatsApp' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Share via SMS' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Share via Share' })).toBeInTheDocument()
    })

    it('should have copy button with proper text', () => {
      renderComponent()
      
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    })
  })
})
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import RemoveMemberDialog from './index'

const theme = createTheme()

const defaultProps = {
  open: true,
  memberName: 'Bob Jones',
  onClose: vi.fn(),
  onConfirm: vi.fn(),
}

const renderDialog = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <RemoveMemberDialog {...defaultProps} {...props} />
    </ThemeProvider>
  )
}

describe('Given the RemoveMemberDialog component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dialog when open', () => {
    renderDialog()

    expect(screen.getByText('Remove Member')).toBeInTheDocument()
    expect(screen.getByText(/Bob Jones/)).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Remove' })
    ).toBeInTheDocument()
  })

  it('should not render dialog when closed', () => {
    renderDialog({ open: false })

    expect(screen.queryByText('Remove Member')).not.toBeInTheDocument()
  })

  it('should display the member name in the confirmation message', () => {
    renderDialog({ memberName: 'Alice Smith' })

    expect(screen.getByText(/Alice Smith/)).toBeInTheDocument()
  })

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn()
    renderDialog({ onClose })

    fireEvent.click(screen.getByText('Cancel'))

    expect(onClose).toHaveBeenCalled()
  })

  it('should call onConfirm when remove button is clicked', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    renderDialog({ onConfirm })

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled()
    })
  })

  it('should display error message when removal fails', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('Network error'))
    renderDialog({ onConfirm })

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should close dialog after successful removal', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()
    renderDialog({ onConfirm, onClose })

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})

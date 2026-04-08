import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import LeaveProjectDialog from './index'

const theme = createTheme()

const defaultProps = {
  open: true,
  projectName: 'Test Project',
  onClose: vi.fn(),
  onConfirm: vi.fn(),
}

const renderDialog = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <LeaveProjectDialog {...defaultProps} {...props} />
    </ThemeProvider>
  )
}

describe('Given the LeaveProjectDialog component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dialog when open', () => {
    renderDialog()

    expect(screen.getAllByText('Leave Project').length).toBeGreaterThanOrEqual(
      1
    )
    expect(screen.getByText(/Test Project/)).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Leave Project' })
    ).toBeInTheDocument()
  })

  it('should not render dialog when closed', () => {
    renderDialog({ open: false })

    expect(screen.queryByText('Leave Project')).not.toBeInTheDocument()
  })

  it('should display the project name in the confirmation message', () => {
    renderDialog({ projectName: 'Family Groceries' })

    expect(screen.getByText(/Family Groceries/)).toBeInTheDocument()
  })

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn()
    renderDialog({ onClose })

    fireEvent.click(screen.getByText('Cancel'))

    expect(onClose).toHaveBeenCalled()
  })

  it('should call onConfirm when leave button is clicked', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    renderDialog({ onConfirm })

    fireEvent.click(screen.getByRole('button', { name: 'Leave Project' }))

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled()
    })
  })

  it('should display error message when leaving fails', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('Network error'))
    renderDialog({ onConfirm })

    fireEvent.click(screen.getByRole('button', { name: 'Leave Project' }))

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should close dialog after successful leave', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()
    renderDialog({ onConfirm, onClose })

    fireEvent.click(screen.getByRole('button', { name: 'Leave Project' }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})

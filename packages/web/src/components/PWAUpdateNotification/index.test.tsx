import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../theme'
import PWAUpdateNotification from './index'

// Mock the usePWAUpdate hook
const mockUsePWAUpdate = {
  isUpdateAvailable: false,
  isUpdating: false,
  updateError: null as string | null,
  isOnline: true,
  installUpdate: jest.fn(),
  dismissUpdate: jest.fn(),
  checkForUpdate: jest.fn(),
}

jest.mock('../../hooks/usePWAUpdate', () => ({
  usePWAUpdate: () => mockUsePWAUpdate,
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('PWAUpdateNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePWAUpdate.isUpdateAvailable = false
    mockUsePWAUpdate.isUpdating = false
    mockUsePWAUpdate.updateError = null
    mockUsePWAUpdate.isOnline = true
  })

  it('should not render when no update available and no error', () => {
    const { container } = renderWithTheme(<PWAUpdateNotification />)
    expect(container.firstChild).toBeNull()
  })

  it('should render update notification when update is available', () => {
    mockUsePWAUpdate.isUpdateAvailable = true

    renderWithTheme(<PWAUpdateNotification />)

    expect(screen.getByText('New Version Available!')).toBeInTheDocument()
    expect(screen.getByText('A new version of Kairos is ready to install.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
  })

  it('should show updating state when update is in progress', () => {
    mockUsePWAUpdate.isUpdateAvailable = true
    mockUsePWAUpdate.isUpdating = true

    renderWithTheme(<PWAUpdateNotification />)

    expect(screen.getByText('Updating...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /updating/i })).toBeDisabled()
  })

  it('should show offline message when offline', () => {
    mockUsePWAUpdate.isUpdateAvailable = true
    mockUsePWAUpdate.isOnline = false

    renderWithTheme(<PWAUpdateNotification />)

    expect(screen.getByText('You\'re offline. Update will install when online.')).toBeInTheDocument()
  })

  it('should call installUpdate when update button is clicked', () => {
    mockUsePWAUpdate.isUpdateAvailable = true

    renderWithTheme(<PWAUpdateNotification />)

    const updateButton = screen.getByRole('button', { name: /update/i })
    fireEvent.click(updateButton)

    expect(mockUsePWAUpdate.installUpdate).toHaveBeenCalledTimes(1)
  })

  it('should call dismissUpdate when close button is clicked', () => {
    mockUsePWAUpdate.isUpdateAvailable = true

    renderWithTheme(<PWAUpdateNotification />)

    const closeButton = screen.getByRole('button', { name: '' }) // Close button has no text
    fireEvent.click(closeButton)

    expect(mockUsePWAUpdate.dismissUpdate).toHaveBeenCalledTimes(1)
  })

  it('should render error notification when there is an update error', () => {
    mockUsePWAUpdate.updateError = 'Update failed: Network error'

    renderWithTheme(<PWAUpdateNotification />)

    expect(screen.getByText('Update Failed')).toBeInTheDocument()
    expect(screen.getByText('Update failed: Network error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('should call checkForUpdate when retry button is clicked', () => {
    mockUsePWAUpdate.updateError = 'Update failed'

    renderWithTheme(<PWAUpdateNotification />)

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    expect(mockUsePWAUpdate.checkForUpdate).toHaveBeenCalledTimes(1)
  })

  it('should disable update button when offline', () => {
    mockUsePWAUpdate.isUpdateAvailable = true
    mockUsePWAUpdate.isOnline = false

    renderWithTheme(<PWAUpdateNotification />)

    const updateButton = screen.getByRole('button', { name: /update/i })
    expect(updateButton).toBeDisabled()
  })

  it('should disable retry button when offline', () => {
    mockUsePWAUpdate.updateError = 'Update failed'
    mockUsePWAUpdate.isOnline = false

    renderWithTheme(<PWAUpdateNotification />)

    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeDisabled()
  })

  it('should disable dismiss button when updating', () => {
    mockUsePWAUpdate.isUpdateAvailable = true
    mockUsePWAUpdate.isUpdating = true

    renderWithTheme(<PWAUpdateNotification />)

    const closeButton = screen.getByRole('button', { name: '' }) // Close button
    expect(closeButton).toBeDisabled()
  })
})
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../theme'
import PWAUpdateTester from './index'

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

describe('PWAUpdateTester', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePWAUpdate.isUpdateAvailable = false
    mockUsePWAUpdate.isUpdating = false
    mockUsePWAUpdate.updateError = null
    mockUsePWAUpdate.isOnline = true
  })

  it('should render PWA update status', () => {
    renderWithTheme(<PWAUpdateTester />)

    expect(screen.getByText('PWA Update Status')).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /check for updates/i })).toBeInTheDocument()
  })

  it('should show offline status when offline', () => {
    mockUsePWAUpdate.isOnline = false

    renderWithTheme(<PWAUpdateTester />)

    expect(screen.getByText('Offline')).toBeInTheDocument()
  })

  it('should show update available chip when update is available', () => {
    mockUsePWAUpdate.isUpdateAvailable = true

    renderWithTheme(<PWAUpdateTester />)

    expect(screen.getByText('Update Available')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /install update/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
  })

  it('should show update error chip when there is an error', () => {
    mockUsePWAUpdate.updateError = 'Update failed: Network error'

    renderWithTheme(<PWAUpdateTester />)

    expect(screen.getByText('Update Error')).toBeInTheDocument()
    expect(screen.getByText('Update failed: Network error')).toBeInTheDocument()
  })

  it('should call checkForUpdate when check button is clicked', () => {
    renderWithTheme(<PWAUpdateTester />)

    const checkButton = screen.getByRole('button', { name: /check for updates/i })
    fireEvent.click(checkButton)

    expect(mockUsePWAUpdate.checkForUpdate).toHaveBeenCalledTimes(1)
  })

  it('should call installUpdate when install button is clicked', () => {
    mockUsePWAUpdate.isUpdateAvailable = true

    renderWithTheme(<PWAUpdateTester />)

    const installButton = screen.getByRole('button', { name: /install update/i })
    fireEvent.click(installButton)

    expect(mockUsePWAUpdate.installUpdate).toHaveBeenCalledTimes(1)
  })

  it('should call dismissUpdate when dismiss button is clicked', () => {
    mockUsePWAUpdate.isUpdateAvailable = true

    renderWithTheme(<PWAUpdateTester />)

    const dismissButton = screen.getByRole('button', { name: /dismiss/i })
    fireEvent.click(dismissButton)

    expect(mockUsePWAUpdate.dismissUpdate).toHaveBeenCalledTimes(1)
  })

  it('should disable check button when updating or offline', () => {
    mockUsePWAUpdate.isUpdating = true
    mockUsePWAUpdate.isOnline = false

    renderWithTheme(<PWAUpdateTester />)

    const checkButton = screen.getByRole('button', { name: /check for updates/i })
    expect(checkButton).toBeDisabled()
  })

  it('should show installing state when updating', () => {
    mockUsePWAUpdate.isUpdateAvailable = true
    mockUsePWAUpdate.isUpdating = true

    renderWithTheme(<PWAUpdateTester />)

    expect(screen.getByText('Installing...')).toBeInTheDocument()
  })

  it('should disable install and dismiss buttons when updating', () => {
    mockUsePWAUpdate.isUpdateAvailable = true
    mockUsePWAUpdate.isUpdating = true

    renderWithTheme(<PWAUpdateTester />)

    const installButton = screen.getByRole('button', { name: /installing/i })
    const dismissButton = screen.getByRole('button', { name: /dismiss/i })

    expect(installButton).toBeDisabled()
    expect(dismissButton).toBeDisabled()
  })

  it('should have proper positioning styles', () => {
    const { container } = renderWithTheme(<PWAUpdateTester />)
    const testerBox = container.firstChild as HTMLElement

    expect(testerBox).toHaveStyle({
      position: 'fixed',
      bottom: '16px',
      right: '16px',
    })
  })
})
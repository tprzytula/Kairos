import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ConnectivityNotification from './index'
import { useInternetConnectivity } from '../../hooks/useInternetConnectivity'

jest.mock('../../hooks/useInternetConnectivity')

const mockUseInternetConnectivity = useInternetConnectivity as jest.MockedFunction<typeof useInternetConnectivity>

describe('ConnectivityNotification', () => {
  const mockResetOfflineState = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should show offline notification when not connected', () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: false,
      wasOffline: true,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })

  it('should not show offline notification when connected', () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: true,
      wasOffline: false,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    expect(screen.queryByText('No internet connection')).not.toBeInTheDocument()
  })

  it('should show reconnected notification when coming back online', () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: true,
      wasOffline: true,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    expect(screen.getByText('Connection restored')).toBeInTheDocument()
  })

  it('should auto-hide reconnected notification after 4 seconds', async () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: true,
      wasOffline: true,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    expect(screen.getByText('Connection restored')).toBeInTheDocument()
    
    jest.advanceTimersByTime(4000)
    
    await waitFor(() => {
      expect(mockResetOfflineState).toHaveBeenCalled()
    })
  })

  it('should manually close reconnected notification when clicked', async () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: true,
      wasOffline: true,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    const notification = screen.getByText('Connection restored').closest('div')
    fireEvent.click(notification!)
    
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(mockResetOfflineState).toHaveBeenCalled()
    })
  })

  it('should manually close reconnected notification when close button clicked', async () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: true,
      wasOffline: true,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    const closeButton = screen.getByRole('button', { name: /close notification/i })
    fireEvent.click(closeButton)
    
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(mockResetOfflineState).toHaveBeenCalled()
    })
  })

  it('should not show reconnected notification when online without being offline first', () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: true,
      wasOffline: false,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    expect(screen.queryByText('Connection restored')).not.toBeInTheDocument()
  })

  it('should not show any notification when offline but never was online', () => {
    mockUseInternetConnectivity.mockReturnValue({
      isOnline: false,
      wasOffline: false,
      resetOfflineState: mockResetOfflineState
    })

    render(<ConnectivityNotification />)
    
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.queryByText('Connection restored')).not.toBeInTheDocument()
  })
})
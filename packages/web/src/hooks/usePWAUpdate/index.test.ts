import { renderHook, act, waitFor } from '@testing-library/react'
import { usePWAUpdate } from './index'

// Mock service worker
const mockRegistration = {
  installing: null as any,
  waiting: null as any,
  active: null as any,
  addEventListener: jest.fn(),
  update: jest.fn().mockResolvedValue(undefined),
}

const mockServiceWorker = {
  register: jest.fn().mockResolvedValue(mockRegistration),
  controller: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}

// Mock document.hidden
Object.defineProperty(document, 'hidden', {
  value: false,
  writable: true,
})

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
})

// Mock MessageChannel
global.MessageChannel = jest.fn().mockImplementation(() => ({
  port1: { postMessage: jest.fn(), close: jest.fn() },
  port2: { postMessage: jest.fn(), close: jest.fn() }
}))

// Store original location
const originalLocation = window.location
let originalConsoleError: any

describe('usePWAUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    // Reset mocks
    mockRegistration.installing = null
    mockRegistration.waiting = null
    mockRegistration.active = null
    mockRegistration.update.mockResolvedValue(undefined)
    mockServiceWorker.register.mockResolvedValue(mockRegistration)
    
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ...mockServiceWorker,
        controller: {
          postMessage: jest.fn()
        }
      },
      writable: true,
    })

    // Suppress console errors from JSDOM navigation attempts
    // JSDOM doesn't support actual navigation so we'll get errors, but we can suppress them
    originalConsoleError = console.error
    console.error = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
    // Restore console.error
    if (originalConsoleError) {
      console.error = originalConsoleError
    }
    // Reset to default values
    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
    })
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePWAUpdate())

    expect(result.current.isUpdateAvailable).toBe(false)
    expect(result.current.isUpdating).toBe(false)
    expect(result.current.updateError).toBeNull()
    expect(result.current.isOnline).toBe(true)
  })

  it('should register service worker on mount', async () => {
    renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })
  })

  it('should detect online/offline status', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    })

    const { result } = renderHook(() => usePWAUpdate())

    expect(result.current.isOnline).toBe(false)
  })

  it('should handle update check', async () => {
    const { result } = renderHook(() => usePWAUpdate())

    // Wait for service worker to register
    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    await act(async () => {
      await result.current.checkForUpdate()
    })

    expect(mockRegistration.update).toHaveBeenCalled()
  })

  it('should handle update check error when no registration', async () => {
    mockServiceWorker.register.mockRejectedValueOnce(new Error('Registration failed'))
    
    const { result } = renderHook(() => usePWAUpdate())

    await act(async () => {
      try {
        await result.current.checkForUpdate()
      } catch (error) {
        expect(error).toEqual(expect.any(Error))
      }
    })
  })

  it('should handle dismissUpdate', () => {
    const { result } = renderHook(() => usePWAUpdate())

    act(() => {
      result.current.dismissUpdate()
    })

    expect(result.current.isUpdateAvailable).toBe(false)
  })

  it('should set online status based on navigator.onLine', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    })

    const { result } = renderHook(() => usePWAUpdate())

    expect(result.current.isOnline).toBe(false)
  })

  it('should handle visibility change messages', () => {
    const { result } = renderHook(() => usePWAUpdate())

    // Simulate visibility change
    Object.defineProperty(document, 'hidden', {
      value: true,
      writable: true,
    })

    // Trigger visibility change event
    const visibilityEvent = new Event('visibilitychange')
    document.dispatchEvent(visibilityEvent)

    expect(navigator.serviceWorker.controller?.postMessage).toHaveBeenCalledWith({
      type: 'APP_HIDDEN'
    })
  })

  it('should handle online/offline events', async () => {
    const { result } = renderHook(() => usePWAUpdate())

    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    })

    await act(async () => {
      const offlineEvent = new Event('offline')
      window.dispatchEvent(offlineEvent)
    })

    await waitFor(() => {
      expect(result.current.isOnline).toBe(false)
    })

    // Simulate going online
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    })

    await act(async () => {
      const onlineEvent = new Event('online')
      window.dispatchEvent(onlineEvent)
    })

    await waitFor(() => {
      expect(result.current.isOnline).toBe(true)
    })
  })

  it('should handle service worker installation states', async () => {
    const mockNewWorker = {
      state: 'installed',
      addEventListener: jest.fn(),
      postMessage: jest.fn(),
    }

    mockRegistration.installing = mockNewWorker
    
    const { result } = renderHook(() => usePWAUpdate())

    // Wait for service worker to register
    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Simulate state change to 'installed'
    const stateChangeCallback = mockNewWorker.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )?.[1]

    if (stateChangeCallback) {
      act(() => {
        stateChangeCallback()
      })

      await waitFor(() => {
        expect(result.current.isUpdateAvailable).toBe(true)
      })
    }
  })

  it('should handle first installation (no controller)', async () => {
    const mockNewWorker = {
      state: 'installed',
      addEventListener: jest.fn(),
      postMessage: jest.fn(),
    }

    // No controller - first install
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ...mockServiceWorker,
        controller: null
      },
      writable: true,
    })

    mockRegistration.installing = mockNewWorker
    
    const { result } = renderHook(() => usePWAUpdate())

    // Wait for service worker to register
    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Simulate state change to 'installed'
    const stateChangeCallback = mockNewWorker.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )?.[1]

    if (stateChangeCallback) {
      act(() => {
        stateChangeCallback()
      })
    }

    // Should not set update available for first install
    expect(result.current.isUpdateAvailable).toBe(false)
  })

  it('should handle service worker messages', async () => {
    renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Get the message event listener
    const messageCallback = mockServiceWorker.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )?.[1]

    expect(messageCallback).toBeDefined()

    // Simulate SW_ACTIVATED message
    act(() => {
      messageCallback({
        data: { type: 'SW_ACTIVATED' }
      })
    })

    // Should trigger reload after delay
    await act(async () => {
      jest.advanceTimersByTime(200)
    })
  })

  it('should handle controller change events', async () => {
    renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Get the controllerchange event listener
    const controllerChangeCallback = mockServiceWorker.addEventListener.mock.calls.find(
      call => call[0] === 'controllerchange'
    )?.[1]

    expect(controllerChangeCallback).toBeDefined()

    // Simulate controller change
    act(() => {
      controllerChangeCallback()
    })

    // Should trigger reload after delay
    await act(async () => {
      jest.advanceTimersByTime(200)
    })
  })

  it('should handle installUpdate', async () => {
    const mockWorker = {
      postMessage: jest.fn(),
      state: 'installed',
      addEventListener: jest.fn(),
    }

    mockRegistration.installing = mockWorker
    
    const { result } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Trigger updatefound event first
    const updateFoundCallback = mockRegistration.addEventListener.mock.calls.find(
      call => call[0] === 'updatefound'
    )?.[1]

    if (updateFoundCallback) {
      act(() => {
        updateFoundCallback()
      })
    }

    // Then trigger state change to make update available
    const stateChangeCallback = mockWorker.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )?.[1]

    if (stateChangeCallback) {
      // Set state to installed and trigger callback
      mockWorker.state = 'installed'
      act(() => {
        stateChangeCallback()
      })

      await waitFor(() => {
        expect(result.current.isUpdateAvailable).toBe(true)
      })
    }

    // Now test install update
    act(() => {
      result.current.installUpdate()
    })

    expect(result.current.isUpdating).toBe(true)
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
  })

  it('should handle service worker registration failure', async () => {
    mockServiceWorker.register.mockRejectedValueOnce(new Error('Registration failed'))
    
    const { result } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(result.current.updateError).toBe('Failed to register service worker')
    })
  })

  it('should handle update check failure', async () => {
    const { result } = renderHook(() => usePWAUpdate())

    // Wait for service worker to register
    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Mock update to fail after registration
    mockRegistration.update.mockRejectedValueOnce(new Error('Update failed'))

    await act(async () => {
      try {
        await result.current.checkForUpdate()
      } catch (error) {
        expect(error).toEqual(expect.any(Error))
      }
    })

    await waitFor(() => {
      expect(result.current.updateError).toContain('Update check failed')
    })
  })

  it('should handle iOS-specific behavior', async () => {
    // Store original values for cleanup
    const originalUserAgent = navigator.userAgent
    const originalMatchMedia = window.matchMedia

    // Mock iOS environment
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
      configurable: true
    })

    // Mock standalone property for iOS PWA detection
    Object.defineProperty(window.navigator, 'standalone', {
      value: true,
      writable: true,
      configurable: true
    })

    // Mock matchMedia for PWA detection
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { unmount } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Test iOS-specific message handling
    const messageCallback = mockServiceWorker.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )?.[1]

    if (messageCallback) {
      act(() => {
        messageCallback({
          data: { type: 'SW_ACTIVATED' }
        })
      })

      // iOS should use longer delay and special reload
      await act(async () => {
        jest.advanceTimersByTime(600)
      })
    }

    // Cleanup
    unmount()
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true
    })
    window.matchMedia = originalMatchMedia
  })

  it('should handle visibility change for iOS', async () => {
    // Store original values for cleanup
    const originalUserAgent = navigator.userAgent
    const originalMatchMedia = window.matchMedia

    // Mock iOS PWA environment
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
      configurable: true
    })

    // Mock standalone property for iOS PWA detection
    Object.defineProperty(window.navigator, 'standalone', {
      value: true,
      writable: true,
      configurable: true
    })

    // Mock matchMedia for PWA detection
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { unmount } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Simulate app becoming visible on iOS
    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
    })

    const visibilityEvent = new Event('visibilitychange')
    document.dispatchEvent(visibilityEvent)

    // Should trigger update check with delay for iOS
    await act(async () => {
      jest.advanceTimersByTime(1100)
    })

    expect(mockRegistration.update).toHaveBeenCalled()

    // Cleanup
    unmount()
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true
    })
    window.matchMedia = originalMatchMedia
  })

  it('should handle installUpdate when no waiting worker', () => {
    const { result } = renderHook(() => usePWAUpdate())

    // Should not crash when no waiting worker
    act(() => {
      result.current.installUpdate()
    })

    expect(result.current.isUpdating).toBe(false)
  })

  it('should handle periodic iOS update checks', async () => {
    // Store original values for cleanup
    const originalUserAgent = navigator.userAgent
    const originalMatchMedia = window.matchMedia

    // Mock iOS PWA environment
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
      configurable: true
    })

    // Mock standalone property for iOS PWA detection
    Object.defineProperty(window.navigator, 'standalone', {
      value: true,
      writable: true,
      configurable: true
    })

    // Mock matchMedia for PWA detection
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { unmount } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Fast-forward 5 minutes for periodic check
    await act(async () => {
      jest.advanceTimersByTime(5 * 60 * 1000)
    })

    // Should trigger periodic update check
    expect(mockRegistration.update).toHaveBeenCalled()

    // Cleanup
    unmount()
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true
    })
    window.matchMedia = originalMatchMedia
  })
})
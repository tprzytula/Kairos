import { renderHook, act, waitFor } from '@testing-library/react'
import { usePWAUpdate, _resetReloadGuard } from './index'

// Mock service worker
const mockRegistration = {
  installing: null as any,
  waiting: null as any,
  active: null as any,
  addEventListener: vi.fn(),
  update: vi.fn().mockResolvedValue(undefined),
}

const mockServiceWorker = {
  register: vi.fn().mockResolvedValue(mockRegistration),
  controller: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
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
class MockMessageChannel {
  port1 = { postMessage: vi.fn(), close: vi.fn(), onmessage: null as any }
  port2 = { postMessage: vi.fn(), close: vi.fn(), onmessage: null as any }
}
global.MessageChannel = MockMessageChannel as any

let originalConsoleError: typeof console.error

interface IOSMockCleanup {
  restore: () => void
}

const setupIOSMocks = (): IOSMockCleanup => {
  const originalUserAgent = navigator.userAgent
  const originalMatchMedia = window.matchMedia

  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    writable: true,
    configurable: true
  })

  Object.defineProperty(window.navigator, 'standalone', {
    value: true,
    writable: true,
    configurable: true
  })

  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: query === '(display-mode: standalone)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  return {
    restore: () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        writable: true,
        configurable: true
      })
      window.matchMedia = originalMatchMedia
    }
  }
}

describe('usePWAUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    _resetReloadGuard()
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
          postMessage: vi.fn()
        }
      },
      writable: true,
    })

    // Suppress console errors from JSDOM navigation attempts
    // JSDOM doesn't support actual navigation so we'll get errors, but we can suppress them
    originalConsoleError = console.error
    console.error = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
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
    const { result: _result } = renderHook(() => usePWAUpdate())

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
      addEventListener: vi.fn(),
      postMessage: vi.fn(),
    }

    mockRegistration.installing = mockNewWorker

    const { result } = renderHook(() => usePWAUpdate())

    // Wait for service worker to register
    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Trigger updatefound first so statechange listener gets attached
    const updateFoundCallback = mockRegistration.addEventListener.mock.calls.find(
      call => call[0] === 'updatefound'
    )?.[1]
    expect(updateFoundCallback).toBeDefined()
    act(() => { updateFoundCallback!() })

    // Now simulate state change to 'installed'
    const stateChangeCallback = mockNewWorker.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )?.[1]

    expect(stateChangeCallback).toBeDefined()
    act(() => {
      stateChangeCallback!()
    })

    await waitFor(() => {
      expect(result.current.isUpdateAvailable).toBe(true)
    })
  })

  it('should handle first installation (no controller)', async () => {
    const mockNewWorker = {
      state: 'installed',
      addEventListener: vi.fn(),
      postMessage: vi.fn(),
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

    // Trigger updatefound first so statechange listener gets attached
    const updateFoundCallback = mockRegistration.addEventListener.mock.calls.find(
      call => call[0] === 'updatefound'
    )?.[1]
    expect(updateFoundCallback).toBeDefined()
    act(() => { updateFoundCallback!() })

    // Simulate state change to 'installed'
    const stateChangeCallback = mockNewWorker.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )?.[1]

    expect(stateChangeCallback).toBeDefined()
    act(() => {
      stateChangeCallback!()
    })

    // Should not set update available for first install
    expect(result.current.isUpdateAvailable).toBe(false)
  })

  it('should not reload on SW_ACTIVATED message', async () => {
    const reloadSpy = vi.spyOn(window.location, 'reload')

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
        data: { type: 'SW_ACTIVATED', version: '1.0.0' }
      })
    })

    // Advance past any potential reload delay
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    // SW_ACTIVATED should NOT trigger a reload (controllerchange is the single reload trigger)
    expect(reloadSpy).not.toHaveBeenCalled()

    reloadSpy.mockRestore()
  })

  it('should reload on controllerchange when a controller existed', async () => {
    const reloadSpy = vi.spyOn(window.location, 'reload')

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
      vi.advanceTimersByTime(200)
    })

    expect(reloadSpy).toHaveBeenCalledTimes(1)

    reloadSpy.mockRestore()
  })

  it('should not reload on controllerchange during first install', async () => {
    const reloadSpy = vi.spyOn(window.location, 'reload')

    // No controller - first install scenario
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ...mockServiceWorker,
        controller: null
      },
      writable: true,
    })

    renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Get the controllerchange event listener
    const controllerChangeCallback = mockServiceWorker.addEventListener.mock.calls.find(
      call => call[0] === 'controllerchange'
    )?.[1]

    expect(controllerChangeCallback).toBeDefined()

    // Simulate controller change (first install)
    act(() => {
      controllerChangeCallback()
    })

    // Advance past any potential reload delay
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    // Should NOT reload on first install
    expect(reloadSpy).not.toHaveBeenCalled()

    reloadSpy.mockRestore()
  })

  it('should handle installUpdate', async () => {
    const mockWorker = {
      postMessage: vi.fn(),
      state: 'installed',
      addEventListener: vi.fn(),
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

    expect(updateFoundCallback).toBeDefined()
    act(() => {
      updateFoundCallback!()
    })

    // Then trigger state change to make update available
    const stateChangeCallback = mockWorker.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )?.[1]

    expect(stateChangeCallback).toBeDefined()
    // Set state to installed and trigger callback
    mockWorker.state = 'installed'
    act(() => {
      stateChangeCallback!()
    })

    await waitFor(() => {
      expect(result.current.isUpdateAvailable).toBe(true)
    })

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
    const { restore } = setupIOSMocks()

    const { unmount } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Smoke test: verifies iOS controllerchange handler is registered and can be
    // invoked without errors. JSDOM doesn't support navigation so we cannot assert
    // that window.location.href was set, but this confirms no runtime exceptions.
    const controllerChangeCallback = mockServiceWorker.addEventListener.mock.calls.find(
      call => call[0] === 'controllerchange'
    )?.[1]

    expect(controllerChangeCallback).toBeDefined()
    act(() => {
      controllerChangeCallback!()
    })

    // iOS should use longer delay (500ms)
    await act(async () => {
      vi.advanceTimersByTime(600)
    })

    unmount()
    restore()
  })

  it('should handle visibility change for iOS', async () => {
    const { restore } = setupIOSMocks()

    const { unmount } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
    })

    const visibilityEvent = new Event('visibilitychange')
    document.dispatchEvent(visibilityEvent)

    // Should trigger update check with delay for iOS
    await act(async () => {
      vi.advanceTimersByTime(1100)
    })

    expect(mockRegistration.update).toHaveBeenCalled()

    unmount()
    restore()
  })

  it('should handle installUpdate when no waiting worker', () => {
    const { result } = renderHook(() => usePWAUpdate())

    // Should not crash when no waiting worker
    act(() => {
      result.current.installUpdate()
    })

    expect(result.current.isUpdating).toBe(false)
  })

  it('should clear error state', async () => {
    const { result } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Mock update to fail
    mockRegistration.update.mockRejectedValueOnce(new Error('Update failed'))

    await act(async () => {
      try {
        await result.current.checkForUpdate()
      } catch {
        // Expected
      }
    })

    await waitFor(() => {
      expect(result.current.updateError).toContain('Update check failed')
    })

    // Clear the error
    act(() => {
      result.current.clearError()
    })

    expect(result.current.updateError).toBeNull()
  })

  it('should reset isUpdating state after timeout', async () => {
    const mockWorker = {
      postMessage: vi.fn(),
      state: 'installed',
      addEventListener: vi.fn(),
    }

    mockRegistration.installing = mockWorker

    const { result } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Trigger updatefound and statechange to make update available
    const updateFoundCallback = mockRegistration.addEventListener.mock.calls.find(
      call => call[0] === 'updatefound'
    )?.[1]
    expect(updateFoundCallback).toBeDefined()
    act(() => { updateFoundCallback!() })

    const stateChangeCallback = mockWorker.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )?.[1]
    expect(stateChangeCallback).toBeDefined()
    mockWorker.state = 'installed'
    act(() => { stateChangeCallback!() })

    await waitFor(() => {
      expect(result.current.isUpdateAvailable).toBe(true)
    })

    // Install update
    act(() => {
      result.current.installUpdate()
    })

    expect(result.current.isUpdating).toBe(true)

    // Fast-forward past the timeout (15 seconds)
    await act(async () => {
      vi.advanceTimersByTime(16000)
    })

    // Should have reset
    expect(result.current.isUpdating).toBe(false)
    expect(result.current.updateError).toContain('timed out')
  })

  it('should handle periodic iOS update checks', async () => {
    const { restore } = setupIOSMocks()

    const { unmount } = renderHook(() => usePWAUpdate())

    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalled()
    })

    // Fast-forward 5 minutes for periodic check
    await act(async () => {
      vi.advanceTimersByTime(5 * 60 * 1000)
    })

    // Should trigger periodic update check
    expect(mockRegistration.update).toHaveBeenCalled()

    unmount()
    restore()
  })
})
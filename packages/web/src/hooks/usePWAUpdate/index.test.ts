import { renderHook, act, waitFor } from '@testing-library/react'
import { usePWAUpdate } from './index'

// Mock service worker
const mockRegistration = {
  installing: null,
  waiting: null,
  active: null,
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

describe('usePWAUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    })
  })

  afterEach(() => {
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

    // Simulate service worker controller
    Object.defineProperty(navigator.serviceWorker, 'controller', {
      value: {
        postMessage: jest.fn(),
      },
      writable: true,
    })

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
})
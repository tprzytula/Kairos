import { Mock } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePushNotifications } from './index'

vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../api/pushSubscriptions', () => ({
  savePushSubscription: vi.fn(),
  deletePushSubscription: vi.fn(),
}))

import { useAuth } from 'react-oidc-context'
import { savePushSubscription, deletePushSubscription } from '../../api/pushSubscriptions'

const mockUseAuth = useAuth as Mock
const mockSavePushSubscription = savePushSubscription as Mock
const mockDeletePushSubscription = deletePushSubscription as Mock

const mockGetSubscription = vi.fn()
const mockSubscribe = vi.fn()
const mockPushSubscriptionUnsubscribe = vi.fn()

const mockPushManager = {
  getSubscription: mockGetSubscription,
  subscribe: mockSubscribe,
}

const mockRegistration = {
  pushManager: mockPushManager,
}

// navigator.serviceWorker cannot be made configurable once defined, so we use
// the same { writable: true } pattern as usePWAUpdate to allow value changes.
Object.defineProperty(navigator, 'serviceWorker', {
  value: { ready: Promise.resolve(mockRegistration) },
  writable: true,
})

Object.defineProperty(window, 'PushManager', {
  value: class PushManager {},
  writable: true,
  configurable: true,
})

Object.defineProperty(window, 'Notification', {
  value: Object.assign(vi.fn(), {
    permission: 'default' as NotificationPermission,
    requestPermission: vi.fn(),
  }),
  writable: true,
  configurable: true,
})

beforeEach(() => {
  vi.clearAllMocks()
  ;(navigator as any).serviceWorker = { ready: Promise.resolve(mockRegistration) }
  ;(window as any).PushManager = class PushManager {}
  ;(window.Notification as any).permission = 'default'
  ;(window.Notification as any).requestPermission = vi.fn()

  mockUseAuth.mockReturnValue({ user: { access_token: 'test-token' } })
  mockGetSubscription.mockResolvedValue(null)
})

describe('usePushNotifications', () => {
  describe('isSupported', () => {
    it('should be true when serviceWorker, PushManager and Notification are available', () => {
      const { result } = renderHook(() => usePushNotifications())

      expect(result.current.isSupported).toBe(true)
    })

    it('should be false when PushManager is not available', () => {
      delete (window as any).PushManager

      const { result } = renderHook(() => usePushNotifications())

      expect(result.current.isSupported).toBe(false)
    })
  })

  describe('initial state', () => {
    it('should initialise permission from Notification.permission', async () => {
      ;(window.Notification as any).permission = 'granted'

      const { result } = renderHook(() => usePushNotifications())

      await waitFor(() => {
        expect(result.current.permission).toBe('granted')
      })
    })

    it('should set isSubscribed to true when a subscription already exists', async () => {
      mockGetSubscription.mockResolvedValue({ endpoint: 'https://example.com' })

      const { result } = renderHook(() => usePushNotifications())

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })
    })

    it('should set isSubscribed to false when no subscription exists', async () => {
      mockGetSubscription.mockResolvedValue(null)

      const { result } = renderHook(() => usePushNotifications())

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(false)
      })
    })

    it('should start with isLoading false and no error', () => {
      const { result } = renderHook(() => usePushNotifications())

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should not check subscription status when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({ user: null })

      renderHook(() => usePushNotifications())

      await new Promise(r => setTimeout(r, 0))

      expect(mockGetSubscription).not.toHaveBeenCalled()
    })
  })

  describe('requestPermission', () => {
    it('should set permission to granted on success', async () => {
      ;(window.Notification as any).requestPermission = vi.fn().mockResolvedValue('granted')

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => {
        await result.current.requestPermission()
      })

      expect(result.current.permission).toBe('granted')
    })

    it('should set isLoading during the request and clear it after', async () => {
      let resolvePermission: (v: string) => void
      ;(window.Notification as any).requestPermission = vi.fn(
        () => new Promise(resolve => { resolvePermission = resolve })
      )

      const { result } = renderHook(() => usePushNotifications())

      act(() => { result.current.requestPermission() })
      expect(result.current.isLoading).toBe(true)

      await act(async () => { resolvePermission!('granted') })
      expect(result.current.isLoading).toBe(false)
    })

    it('should set error and throw when permission is denied', async () => {
      ;(window.Notification as any).requestPermission = vi.fn().mockResolvedValue('denied')

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => {
        try { await result.current.requestPermission() } catch (_) {}
      })

      expect(result.current.error).toBe('Permission denied for notifications')
    })

    it('should throw when push notifications are not supported', async () => {
      delete (window as any).PushManager

      const { result } = renderHook(() => usePushNotifications())

      await expect(
        act(async () => { await result.current.requestPermission() })
      ).rejects.toThrow('Push notifications are not supported')
    })
  })

  describe('subscribe', () => {
    beforeEach(() => {
      ;(window.Notification as any).permission = 'granted'
    })

    it('should subscribe and save the subscription to the server', async () => {
      const mockSubscription = {
        endpoint: 'https://push.example.com/sub',
        getKey: vi.fn(() => new ArrayBuffer(8)),
      }
      mockGetSubscription.mockResolvedValue(null)
      mockSubscribe.mockResolvedValue(mockSubscription)
      mockSavePushSubscription.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => { await result.current.subscribe() })

      expect(mockSubscribe).toHaveBeenCalledWith(
        expect.objectContaining({ userVisibleOnly: true })
      )
      expect(mockSavePushSubscription).toHaveBeenCalledWith(
        expect.objectContaining({ endpoint: 'https://push.example.com/sub' }),
        'test-token'
      )
      expect(result.current.isSubscribed).toBe(true)
    })

    it('should not create a new subscription if one already exists', async () => {
      mockGetSubscription.mockResolvedValue({ endpoint: 'https://existing.com' })

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => { await result.current.subscribe() })

      expect(mockSubscribe).not.toHaveBeenCalled()
      expect(result.current.isSubscribed).toBe(true)
    })

    it('should clear isLoading after subscription completes', async () => {
      const mockSubscription = {
        endpoint: 'https://push.example.com/sub',
        getKey: vi.fn(() => new ArrayBuffer(8)),
      }
      mockGetSubscription.mockResolvedValue(null)
      mockSubscribe.mockResolvedValue(mockSubscription)
      mockSavePushSubscription.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => { await result.current.subscribe() })

      expect(result.current.isLoading).toBe(false)
    })

    it('should set error and throw when subscribe fails', async () => {
      mockGetSubscription.mockResolvedValue(null)
      mockSubscribe.mockRejectedValue(new Error('Subscribe failed'))

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => {
        try { await result.current.subscribe() } catch (_) {}
      })

      expect(result.current.error).toBe('Subscribe failed')
    })

    it('should throw when permission is not granted', async () => {
      ;(window.Notification as any).permission = 'default'

      const { result } = renderHook(() => usePushNotifications())

      await expect(
        act(async () => { await result.current.subscribe() })
      ).rejects.toThrow('Permission not granted for notifications')
    })

    it('should throw when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({ user: null })

      const { result } = renderHook(() => usePushNotifications())

      await expect(
        act(async () => { await result.current.subscribe() })
      ).rejects.toThrow('Push notifications are not supported or user not authenticated')
    })
  })

  describe('unsubscribe', () => {
    it('should unsubscribe and delete the subscription from the server', async () => {
      const mockSubscription = {
        endpoint: 'https://push.example.com/sub',
        unsubscribe: mockPushSubscriptionUnsubscribe,
      }
      mockGetSubscription.mockResolvedValue(mockSubscription)
      mockPushSubscriptionUnsubscribe.mockResolvedValue(true)
      mockDeletePushSubscription.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => { await result.current.unsubscribe() })

      expect(mockPushSubscriptionUnsubscribe).toHaveBeenCalled()
      expect(mockDeletePushSubscription).toHaveBeenCalledWith(
        'https://push.example.com/sub',
        'test-token'
      )
      expect(result.current.isSubscribed).toBe(false)
    })

    it('should set isSubscribed to false when there is no existing subscription', async () => {
      mockGetSubscription.mockResolvedValue(null)

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => { await result.current.unsubscribe() })

      expect(mockPushSubscriptionUnsubscribe).not.toHaveBeenCalled()
      expect(result.current.isSubscribed).toBe(false)
    })

    it('should set error and throw when unsubscribe fails', async () => {
      const mockSubscription = {
        endpoint: 'https://push.example.com/sub',
        unsubscribe: vi.fn().mockRejectedValue(new Error('Unsubscribe failed')),
      }
      mockGetSubscription.mockResolvedValue(mockSubscription)

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => {
        try { await result.current.unsubscribe() } catch (_) {}
      })

      expect(result.current.error).toBe('Unsubscribe failed')
    })

    it('should throw when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({ user: null })

      const { result } = renderHook(() => usePushNotifications())

      await expect(
        act(async () => { await result.current.unsubscribe() })
      ).rejects.toThrow('Push notifications are not supported or user not authenticated')
    })

    it('should clear isLoading after unsubscribe completes', async () => {
      const mockSubscription = {
        endpoint: 'https://push.example.com/sub',
        unsubscribe: mockPushSubscriptionUnsubscribe,
      }
      mockGetSubscription.mockResolvedValue(mockSubscription)
      mockPushSubscriptionUnsubscribe.mockResolvedValue(true)
      mockDeletePushSubscription.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePushNotifications())

      await act(async () => { await result.current.unsubscribe() })

      expect(result.current.isLoading).toBe(false)
    })
  })
})

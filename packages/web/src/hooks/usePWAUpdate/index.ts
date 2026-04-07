import { useState, useEffect, useCallback, useRef } from 'react'
import { UsePWAUpdateReturn } from './types'

const swUrl = '/sw.js'

const SW_MESSAGE = {
  SKIP_WAITING: 'SKIP_WAITING',
  GET_VERSION: 'GET_VERSION',
  APP_VISIBLE: 'APP_VISIBLE',
  APP_HIDDEN: 'APP_HIDDEN',
} as const

// Detect iOS devices (computed once at module load)
const iOS = (() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
         !('MSStream' in window)
})()

// Detect if running as installed PWA (computed once at module load)
const pwa = (() => {
  if (typeof window === 'undefined') return false

  const matchMedia = window.matchMedia
  if (!matchMedia) return false

  return matchMedia('(display-mode: standalone)').matches ||
         ('standalone' in window.navigator && (window.navigator as Navigator & { standalone: boolean }).standalone === true)
})()

// Module-level guard to prevent multiple reloads in the same page lifecycle
let reloading = false

/** @internal Reset the reload guard — only for use in tests */
export const _resetReloadGuard = (): void => {
  reloading = false
}

export const usePWAUpdate = (): UsePWAUpdateReturn => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const waitingWorkerRef = useRef<ServiceWorker | null>(null)
  const currentVersionRef = useRef<string | null>(null)

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // iOS-specific version checking function
  const checkServiceWorkerVersion = useCallback(async (): Promise<void> => {
    if (!registrationRef.current || !iOS || !pwa) return

    const messageChannel = new MessageChannel()

    try {
      const versionPromise = new Promise<string>((resolve, reject) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data && event.data.type === 'SW_VERSION') {
            resolve(event.data.version)
          } else {
            reject(new Error('Invalid version response'))
          }
        }

        setTimeout(() => reject(new Error('Version check timeout')), 5000)
      })

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { type: SW_MESSAGE.GET_VERSION },
          [messageChannel.port2]
        )

        const newVersion = await versionPromise
        messageChannel.port1.close()

        if (currentVersionRef.current && currentVersionRef.current !== newVersion) {
          console.log('[PWA] Version change detected:', currentVersionRef.current, '->', newVersion)
          setIsUpdateAvailable(true)
        }

        currentVersionRef.current = newVersion
      }
    } catch (error) {
      messageChannel.port1.close()
      console.warn('[PWA] Version check failed:', error)
    }
  }, [])

  // Register service worker and set up update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Track whether a controller existed at registration time to distinguish
      // first install (no controller) from updates (had a controller)
      const hadController = !!navigator.serviceWorker.controller

      navigator.serviceWorker
        .register(swUrl, {
          // iOS-specific: Always check for updates
          updateViaCache: iOS ? 'none' : 'imports'
        })
        .then(registration => {
          registrationRef.current = registration

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              console.log('[PWA] New service worker installing')
              newWorker.addEventListener('statechange', () => {
                console.log('[PWA] Service worker state:', newWorker.state)

                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New version available
                    console.log('[PWA] New version detected')
                    waitingWorkerRef.current = newWorker
                    setIsUpdateAvailable(true)
                  } else {
                    // First install
                    console.log('[PWA] First install')
                  }
                }
              })
            }
          })

          // iOS-specific: Force immediate update check
          if (iOS && pwa) {
            console.log('[PWA] iOS PWA detected, performing enhanced update checks')
            registration.update()

            // Additional iOS workaround: Check version periodically
            checkServiceWorkerVersion()
          } else {
            // Check for updates immediately
            registration.update()
          }
        })
        .catch(error => {
          console.error('Service worker registration failed:', error)
          setUpdateError('Failed to register service worker')
        })

      // Listen for messages from service worker (informational only, no reload)
      const handleMessage = (event: MessageEvent): void => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          console.log('[PWA] Service worker activated, version:', event.data.version)
        }
      }

      // Listen for service worker controller changes — single source of truth for reloads
      const handleControllerChange = (): void => {
        // Only reload if this is an update (had a previous controller) and we haven't
        // already started a reload. On first install, controllerchange fires when the
        // page goes from no controller to having one — no reload needed.
        if (!hadController || reloading) return

        console.log('[PWA] Service worker controller changed, reloading page')
        reloading = true

        setTimeout(() => {
          if (iOS && pwa) {
            // iOS-specific: Force reload with cache bypass, replacing any existing v param
            const url = new URL(window.location.href)
            url.searchParams.set('v', Date.now().toString())
            window.location.href = url.toString()
          } else {
            window.location.reload()
          }
        }, iOS ? 500 : 100)
      }

      navigator.serviceWorker.addEventListener('message', handleMessage)
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage)
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      }
    }
  }, [checkServiceWorkerVersion])

  // Handle visibility change for update checks
  useEffect(() => {
    const handleVisibilityChange = () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: document.hidden ? SW_MESSAGE.APP_HIDDEN : SW_MESSAGE.APP_VISIBLE
        })
      }
      
      // iOS-specific: Check for updates when app becomes visible
      if (!document.hidden && iOS && pwa) {
        setTimeout(() => {
          checkServiceWorkerVersion()
          if (registrationRef.current) {
            registrationRef.current.update()
          }
        }, 1000) // Delay to ensure app is fully resumed
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Initial visibility state
    handleVisibilityChange()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [checkServiceWorkerVersion])

  // iOS-specific: Periodic update checks when app is visible
  useEffect(() => {
    if (!iOS || !pwa) return

    const intervalId = setInterval(() => {
      if (!document.hidden && registrationRef.current) {
        console.log('[PWA] Periodic update check (iOS)')
        checkServiceWorkerVersion()
        registrationRef.current.update().catch(() => {
          // Ignore errors for background updates
        })
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(intervalId)
  }, [checkServiceWorkerVersion])

  const checkForUpdate = useCallback(async (): Promise<void> => {
    if (!registrationRef.current) {
      throw new Error('Service worker not registered')
    }

    try {
      setUpdateError(null)
      console.log('[PWA] Manual update check requested')

      // iOS-specific: Force bypass cache for update check
      if (iOS && pwa) {
        await checkServiceWorkerVersion()
      }

      await registrationRef.current.update()

      // If we already have a waiting worker (e.g. user dismissed earlier), re-show notification
      if (waitingWorkerRef.current) {
        setIsUpdateAvailable(true)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setUpdateError(`Update check failed: ${errorMessage}`)
      throw error
    }
  }, [checkServiceWorkerVersion])

  const installUpdate = useCallback(() => {
    if (waitingWorkerRef.current) {
      console.log('[PWA] Installing update')
      setIsUpdating(true)

      // Timeout: if update hasn't completed (page reloaded) in 15s, reset state
      setTimeout(() => {
        setIsUpdating(false)
        setUpdateError('Update timed out. Please try again or refresh manually.')
      }, 15000)

      // iOS-specific: Add delay before skip waiting
      if (iOS && pwa) {
        setTimeout(() => {
          waitingWorkerRef.current?.postMessage({ type: SW_MESSAGE.SKIP_WAITING })
        }, 100)
      } else {
        waitingWorkerRef.current.postMessage({ type: SW_MESSAGE.SKIP_WAITING })
      }
    }
  }, [])

  const dismissUpdate = useCallback(() => {
    setIsUpdateAvailable(false)
    // Don't null out waitingWorkerRef — the worker is still waiting
    // and can be activated if the user triggers update later via checkForUpdate
  }, [])

  const clearError = useCallback(() => {
    setUpdateError(null)
  }, [])

  return {
    isUpdateAvailable,
    isUpdating,
    updateError,
    isOnline,
    checkForUpdate,
    installUpdate,
    dismissUpdate,
    clearError
  }
}

export default usePWAUpdate
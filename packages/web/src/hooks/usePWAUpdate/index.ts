import { useState, useEffect, useCallback, useRef } from 'react'
// @ts-ignore
import swUrl from 'url:../../sw.js'

interface PWAUpdateState {
  isUpdateAvailable: boolean
  isUpdating: boolean
  updateError: string | null
  isOnline: boolean
}

interface PWAUpdateActions {
  checkForUpdate: () => Promise<void>
  installUpdate: () => void
  dismissUpdate: () => void
}

export const usePWAUpdate = (): PWAUpdateState & PWAUpdateActions => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const waitingWorkerRef = useRef<ServiceWorker | null>(null)

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

  // Register service worker and set up update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          registrationRef.current = registration

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  waitingWorkerRef.current = newWorker
                  setIsUpdateAvailable(true)
                }
              })
            }
          })

          // Check for updates immediately
          registration.update()
        })
        .catch(error => {
          console.error('Service worker registration failed:', error)
          setUpdateError('Failed to register service worker')
        })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          // New service worker activated - reload to get latest version
          window.location.reload()
        }
      })

      // Listen for service worker controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service worker updated, reload to get new content
        window.location.reload()
      })
    }
  }, [])

  // Handle visibility change for update checks
  useEffect(() => {
    const handleVisibilityChange = () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: document.hidden ? 'APP_HIDDEN' : 'APP_VISIBLE'
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Initial visibility state
    handleVisibilityChange()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const checkForUpdate = useCallback(async (): Promise<void> => {
    if (!registrationRef.current) {
      throw new Error('Service worker not registered')
    }

    try {
      setUpdateError(null)
      await registrationRef.current.update()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setUpdateError(`Update check failed: ${errorMessage}`)
      throw error
    }
  }, [])

  const installUpdate = useCallback(() => {
    if (waitingWorkerRef.current) {
      setIsUpdating(true)
      waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [])

  const dismissUpdate = useCallback(() => {
    setIsUpdateAvailable(false)
    waitingWorkerRef.current = null
  }, [])

  return {
    isUpdateAvailable,
    isUpdating,
    updateError,
    isOnline,
    checkForUpdate,
    installUpdate,
    dismissUpdate
  }
}

export default usePWAUpdate
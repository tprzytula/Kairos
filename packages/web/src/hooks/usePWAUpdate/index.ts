import { useState, useEffect, useCallback, useRef } from 'react'
// @ts-ignore
import swUrl from 'url:../../sw.js'

// Detect iOS devices
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && 
         !(window as any).MSStream
}

// Detect if running as installed PWA
const isPWA = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false
  
  // Check if matchMedia is available (not available in some test environments)
  const matchMedia = window.matchMedia
  if (!matchMedia) return false
  
  return matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

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
  const currentVersionRef = useRef<string | null>(null)
  const iOS = isIOS()
  const pwa = isPWA()

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

    try {
      const messageChannel = new MessageChannel()
      
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
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        )

        const newVersion = await versionPromise
        
        if (currentVersionRef.current && currentVersionRef.current !== newVersion) {
          console.log('[PWA] Version change detected:', currentVersionRef.current, '->', newVersion)
          setIsUpdateAvailable(true)
        }
        
        currentVersionRef.current = newVersion
      }
    } catch (error) {
      console.warn('[PWA] Version check failed:', error)
    }
  }, [iOS, pwa])

  // Register service worker and set up update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
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

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          console.log('[PWA] Service worker activated, reloading page')
          // Add slight delay for iOS compatibility
          setTimeout(() => {
            if (iOS && pwa) {
              // iOS-specific: Force reload with cache bypass
              window.location.href = window.location.href + '?v=' + Date.now()
            } else {
              window.location.reload()
            }
          }, iOS ? 500 : 100)
        }
      })

      // Listen for service worker controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service worker controller changed, reloading page')
        // Add slight delay for iOS compatibility
        setTimeout(() => {
          if (iOS && pwa) {
            // iOS-specific: Force reload with cache bypass
            window.location.href = window.location.href + '?v=' + Date.now()
          } else {
            window.location.reload()
          }
        }, iOS ? 500 : 100)
      })
    }
  }, [iOS, pwa, checkServiceWorkerVersion])

  // Handle visibility change for update checks
  useEffect(() => {
    const handleVisibilityChange = () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: document.hidden ? 'APP_HIDDEN' : 'APP_VISIBLE'
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
  }, [iOS, pwa, checkServiceWorkerVersion])

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
  }, [iOS, pwa, checkServiceWorkerVersion])

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setUpdateError(`Update check failed: ${errorMessage}`)
      throw error
    }
  }, [iOS, pwa, checkServiceWorkerVersion])

  const installUpdate = useCallback(() => {
    if (waitingWorkerRef.current) {
      console.log('[PWA] Installing update')
      setIsUpdating(true)
      
      // iOS-specific: Add delay before skip waiting
      if (iOS && pwa) {
        setTimeout(() => {
          waitingWorkerRef.current?.postMessage({ type: 'SKIP_WAITING' })
        }, 100)
      } else {
        waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' })
      }
    }
  }, [iOS, pwa])

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
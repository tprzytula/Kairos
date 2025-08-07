/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

interface ExtendableMessageEvent extends ExtendableEvent {
  data: any
  ports: readonly MessagePort[]
}

// Version is automatically replaced during build from package.json
// This placeholder will be replaced by the CI/CD pipeline
const APP_VERSION = '__APP_VERSION__'
const CACHE_NAME = `kairos-v${APP_VERSION}`
const RUNTIME_CACHE = `kairos-runtime-v${APP_VERSION}`

// Files to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other critical assets as needed
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', APP_VERSION)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => {
        console.log('[SW] Files cached successfully')
        // Don't call skipWaiting immediately - let user control this
        return true
      })
  )
})

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', APP_VERSION)
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        console.log('[SW] Found caches:', cacheNames)
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          }).filter(Boolean)
        )
      }),
      // Take control of all pages immediately for iOS compatibility
      self.clients.claim().then(() => {
        console.log('[SW] Claimed all clients')
      })
    ])
  )

  // Notify all clients that a new version is available
  self.clients.matchAll({ includeUncontrolled: true }).then((clients: readonly Client[]) => {
    console.log('[SW] Notifying clients:', clients.length)
    clients.forEach((client: Client) => {
      client.postMessage({
        type: 'SW_ACTIVATED',
        payload: 'Service worker activated - new version available',
        version: APP_VERSION
      })
    })
  })
})

// Fetch event - network first for API calls, cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API calls - always try network first
  if (url.pathname.includes('/api/') || url.hostname.includes('amazonaws.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses for offline support
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then(response => response || new Response('Offline', { status: 503 }))
        })
    )
    return
  }

  // Handle app files - cache first with network fallback
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached version and update in background
          fetch(request).then(response => {
            if (response.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response.clone())
              })
            }
          }).catch(() => {
            // Network failed, cached version is fine
          })
          return cachedResponse
        }

        // Not in cache, fetch from network
        return fetch(request).then(response => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      })
  )
})

// Listen for update check requests from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_FOR_UPDATE') {
    // Force update check
    event.waitUntil(
      self.registration.update().then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            type: 'UPDATE_CHECK_COMPLETE'
          })
        }
      })
    )
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested')
    self.skipWaiting()
  }

  // iOS-specific: Handle version check requests
  if (event.data && event.data.type === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({
        type: 'SW_VERSION',
        version: APP_VERSION
      })
    }
  }
})

// Check for updates every 30 minutes when app is active
let updateCheckInterval: ReturnType<typeof setInterval> | undefined

const handleVisibilityMessage = (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'APP_VISIBLE') {
    // Clear existing interval
    if (updateCheckInterval) {
      clearInterval(updateCheckInterval)
    }
    
    // Set up periodic update checks
    updateCheckInterval = setInterval(() => {
      self.registration.update()
    }, 30 * 60 * 1000) // 30 minutes
  }

  if (event.data && event.data.type === 'APP_HIDDEN') {
    // Clear interval when app is hidden
    if (updateCheckInterval) {
      clearInterval(updateCheckInterval)
    }
  }
}

self.addEventListener('message', handleVisibilityMessage)

export {}
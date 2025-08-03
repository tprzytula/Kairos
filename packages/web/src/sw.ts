/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

interface ExtendableMessageEvent extends ExtendableEvent {
  data: any
  ports: readonly MessagePort[]
}

const CACHE_NAME = 'kairos-v1'
const RUNTIME_CACHE = 'kairos-runtime'

// Files to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other critical assets as needed
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // Force activation of new service worker
  )
})

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  )

  // Notify all clients that a new version is available
  self.clients.matchAll().then((clients: readonly Client[]) => {
    clients.forEach((client: Client) => {
      client.postMessage({
        type: 'SW_ACTIVATED',
        payload: 'Service worker activated - new version available'
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
    self.skipWaiting()
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
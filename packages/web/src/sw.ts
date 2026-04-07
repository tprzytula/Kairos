/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

enum SWMessageType {
  CHECK_FOR_UPDATE = 'CHECK_FOR_UPDATE',
  SKIP_WAITING = 'SKIP_WAITING',
  GET_VERSION = 'GET_VERSION',
  APP_VISIBLE = 'APP_VISIBLE',
  APP_HIDDEN = 'APP_HIDDEN',
}

// Version is automatically replaced during build from package.json
// This placeholder will be replaced by the CI/CD pipeline
const APP_VERSION = '__APP_VERSION__'
const CACHE_NAME = `kairos-v${APP_VERSION}`
const RUNTIME_CACHE = `kairos-runtime-v${APP_VERSION}`

const DEBUG = APP_VERSION === '__APP_VERSION__'
function log(...args: unknown[]): void {
  if (DEBUG) console.log(...args)
}

const CACHEABLE_RESOURCES = ['grocery_list', 'todo_list', 'noise_tracking'] as const

function authCacheKey(authHeader: string): string {
  // Use the JWT signature (last segment) as a unique per-user identifier
  const parts = authHeader.split('.')
  if (parts.length >= 3) {
    return parts[parts.length - 1].slice(-32)
  }
  // Fallback: use last 32 chars of the header
  return authHeader.slice(-32)
}

function cacheNetworkResponse(cacheName: string, cacheKey: Request | string, response: Response): void {
  if (response.status === 200) {
    const clone = response.clone()
    caches.open(cacheName).then(cache => {
      cache.put(cacheKey, cacheName === RUNTIME_CACHE ? addCacheTimestamp(clone) : clone)
    }).catch(() => {
      // Cache storage failed (quota exceeded, etc.)
    })
  }
}

// Files to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other critical assets as needed
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  log('[SW] Installing version:', APP_VERSION)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => {
        log('[SW] Files cached successfully')
      })
  )
})

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  log('[SW] Activating version:', APP_VERSION)

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        log('[SW] Found caches:', cacheNames)
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          }).filter(Boolean)
        )
      }),
      // Take control of all pages immediately for iOS compatibility,
      // then notify clients after claim completes
      self.clients.claim().then(() => {
        log('[SW] Claimed all clients')
        return self.clients.matchAll({ includeUncontrolled: true })
      }).then((clients: readonly Client[]) => {
        log('[SW] Notifying clients:', clients.length)
        clients.forEach((client: Client) => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: APP_VERSION
          })
        })
      })
    ])
  )
})

// Fetch event - cache strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API calls
  if (url.pathname.includes('/api/') || (url.hostname.includes('.execute-api.') && url.hostname.endsWith('.amazonaws.com'))) {
    // Check if this is a GET request for retrieving data
    if (request.method === 'GET' && isDataRetrievalEndpoint(url.pathname)) {
      // Use a user-specific cache key based on the Authorization header to prevent
      // private items from leaking between users via the service worker cache
      const authHeader = request.headers.get('Authorization') || ''
      const cacheKeyUrl = authHeader
        ? `${request.url}#auth=${authCacheKey(authHeader)}`
        : request.url
      const cacheRequest = new Request(cacheKeyUrl)

      // User preferences need fresh data - use Network First
      if (url.pathname.includes('/user/preferences')) {
        event.respondWith(
          fetch(request)
            .then(response => {
              cacheNetworkResponse(RUNTIME_CACHE, cacheRequest, response)
              return response
            })
            .catch(() => {
              // Network failed, return cached preferences if available
              return caches.match(cacheRequest).then(cachedResponse => {
                return cachedResponse || new Response('{"userId":"","lastUpdated":0}', {
                  status: 200,
                  headers: { 'Content-Type': 'application/json', 'X-SW-Offline': 'true' }
                })
              })
            })
        )
      } else {
        // Cache First strategy for item lists - show cached data immediately, update in background
        event.respondWith(
          caches.match(cacheRequest).then(cachedResponse => {
            // If we have cached data, return it immediately
            if (cachedResponse && !isCacheExpired(cachedResponse)) {
              // Update in background (Stale While Revalidate)
              fetch(request)
                .then(response => {
                  cacheNetworkResponse(RUNTIME_CACHE, cacheRequest, response)
                })
                .catch(() => {
                  // Background update failed, but we still have cached data
                })

              return cachedResponse
            }

            // No cache or cache expired, try network first
            return fetch(request)
              .then(response => {
                cacheNetworkResponse(RUNTIME_CACHE, cacheRequest, response)
                return response
              })
              .catch(() => {
                // Network failed, return stale cache if available
                return cachedResponse || new Response('[]', {
                  status: 200,
                  headers: { 'Content-Type': 'application/json', 'X-SW-Offline': 'true' }
                })
              })
          })
        )
      }
    } else {
      // For POST/PUT/DELETE requests - always try network first
      event.respondWith(
        fetch(request)
          .then(response => {
            // If successful mutation, invalidate related cache entries
            if (response.status >= 200 && response.status < 300) {
              invalidateRelatedCache(url.pathname)
            }
            return response
          })
          .catch(_error => {
            // For mutations, we can't use cache - return error
            return new Response(JSON.stringify({ error: 'Offline - changes cannot be saved' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json', 'X-SW-Offline': 'true' }
            })
          })
      )
    }
    return
  }

  // Only cache GET requests — Cache API doesn't support POST/PUT/DELETE
  if (request.method !== 'GET') {
    return
  }

  // Handle app files - cache first with network fallback
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached version and update in background
          fetch(request).then(response => {
            if (!isMismatchedContentType(request, response)) {
              cacheNetworkResponse(CACHE_NAME, request, response)
            }
          }).catch(() => {
            // Network failed, cached version is fine
          })
          return cachedResponse
        }

        // Not in cache, fetch from network
        return fetch(request).then(response => {
          // Don't cache HTML fallback responses for JS/CSS assets
          // (CloudFront returns index.html with 200 for missing files)
          if (!isMismatchedContentType(request, response)) {
            cacheNetworkResponse(CACHE_NAME, request, response)
          }
          return response
        })
      })
  )
})

// Helper function to detect CloudFront SPA fallback serving HTML for non-HTML assets
function isMismatchedContentType(request: Request, response: Response): boolean {
  const contentType = response.headers.get('content-type') || ''
  const url = new URL(request.url)
  const path = url.pathname

  // If the server returned HTML for a JS/CSS/image request, it's a SPA fallback
  if (contentType.includes('text/html')) {
    const isAssetRequest = /\.(js|mjs|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|ico|json|wasm)(\?|$)/.test(path)
    return isAssetRequest
  }

  return false
}

// Helper function to check if URL is a data retrieval endpoint
function isDataRetrievalEndpoint(pathname: string): boolean {
  // Item-based endpoints (cache-friendly) - use Cache First strategy
  const isItemEndpoint = pathname.includes('/items') &&
    CACHEABLE_RESOURCES.some(resource => pathname.includes(resource))

  // User preferences endpoints (network-first for freshness) - use Network First strategy
  const isUserPreferencesEndpoint = pathname.includes('/user/preferences')

  return isItemEndpoint || isUserPreferencesEndpoint
}

// Helper function to check if cache is expired (30 minutes)
function isCacheExpired(response: Response): boolean {
  const cacheTimestamp = response.headers.get('sw-cache-timestamp')
  if (!cacheTimestamp) return true
  
  const thirtyMinutes = 30 * 60 * 1000
  return Date.now() - parseInt(cacheTimestamp) > thirtyMinutes
}

// Helper function to add cache timestamp to response
function addCacheTimestamp(response: Response): Response {
  const newHeaders = new Headers(response.headers)
  newHeaders.set('sw-cache-timestamp', Date.now().toString())
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}

// Helper function to invalidate cache entries related to a mutation
function invalidateRelatedCache(pathname: string): void {
  caches.open(RUNTIME_CACHE).then(cache => {
    cache.keys().then(requests => {
      requests.forEach(request => {
        const requestUrl = new URL(request.url)
        // Invalidate cache for the same resource type
        const matchesResource = CACHEABLE_RESOURCES.some(
          resource => pathname.includes(resource) && requestUrl.pathname.includes(resource)
        )
        if (
          matchesResource ||
          (pathname.includes('/user/preferences') && requestUrl.pathname.includes('/user/preferences'))
        ) {
          cache.delete(request)
        }
      })
    }).catch(() => {})
  }).catch(() => {})
}

// Check for updates every 30 minutes when app is active
let updateCheckInterval: ReturnType<typeof setInterval> | undefined

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (!event.data) return

  const { type } = event.data

  if (type === SWMessageType.CHECK_FOR_UPDATE) {
    event.waitUntil(
      self.registration.update().then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ type: 'UPDATE_CHECK_COMPLETE' })
        }
      })
    )
  }

  if (type === SWMessageType.SKIP_WAITING) {
    log('[SW] Skip waiting requested')
    self.skipWaiting()
  }

  if (type === SWMessageType.GET_VERSION) {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ type: 'SW_VERSION', version: APP_VERSION })
    }
  }

  if (type === SWMessageType.APP_VISIBLE) {
    if (updateCheckInterval) clearInterval(updateCheckInterval)
    updateCheckInterval = setInterval(() => {
      self.registration.update()
    }, 30 * 60 * 1000)
  }

  if (type === SWMessageType.APP_HIDDEN) {
    if (updateCheckInterval) clearInterval(updateCheckInterval)
  }
})

self.addEventListener('push', (event) => {
  log('[SW] Push notification received:', event)
  
  if (!event.data) {
    log('[SW] Push notification received but no data')
    event.waitUntil(
      self.registration.showNotification('Kairos', {
        body: 'You have a new notification',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        tag: 'kairos-no-data'
      })
    )
    return
  }

  try {
    const data = event.data.json()
    log('[SW] Push notification data:', data)
    
    const options = {
      body: data.body || 'New notification from Kairos',
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      data: data.data || {},
      requireInteraction: false,
      silent: false,
      tag: data.data?.type || 'kairos-notification',
      timestamp: Date.now(),
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: '/icon-72.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Kairos', options)
    )
  } catch (error) {
    console.error('[SW] Error processing push notification:', error)
    
    event.waitUntil(
      self.registration.showNotification('Kairos', {
        body: 'You have a new notification',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        tag: 'kairos-fallback'
      })
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  log('[SW] Notification click received:', event)
  
  event.notification.close()
  
  const notificationData = event.notification.data || {}

  let urlToOpen = '/'
  
  if (notificationData.projectId) {
    urlToOpen = `/?project=${notificationData.projectId}`
  }
  
  if (notificationData.type === 'todo_added' && notificationData.todoId) {
    urlToOpen = `${urlToOpen}#todo-${notificationData.todoId}`
  }
  
  log('[SW] Opening URL:', urlToOpen)
  
  const targetUrl = new URL(urlToOpen, self.registration.scope)

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList: readonly Client[]) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url)
        if (clientUrl.pathname === targetUrl.pathname && 'focus' in client) {
          return (client as WindowClient).focus()
        }
      }

      for (const client of clientList) {
        if (client.url.startsWith(self.registration.scope) && 'navigate' in client) {
          return (client as WindowClient).navigate(urlToOpen).then(c => c ? c.focus() : undefined)
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen)
      }
    })
  )
})

self.addEventListener('notificationclose', (event) => {
  log('[SW] Notification closed:', event.notification.tag)
})

export {}
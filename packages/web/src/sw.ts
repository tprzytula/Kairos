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

// Fetch event - cache strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API calls with improved caching strategy
  if (url.pathname.includes('/api/') || url.hostname.includes('amazonaws.com')) {
    // Check if this is a GET request for retrieving data
    if (request.method === 'GET' && isDataRetrievalEndpoint(url.pathname)) {
      // User preferences need fresh data - use Network First
      if (url.pathname.includes('/user/preferences')) {
        event.respondWith(
          fetch(request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(RUNTIME_CACHE).then(cache => {
                  cache.put(request, addCacheTimestamp(responseClone))
                })
              }
              return response
            })
            .catch(() => {
              // Network failed, return cached preferences if available
              return caches.match(request).then(cachedResponse => {
                return cachedResponse || new Response('{"userId":"","lastUpdated":0}', {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                })
              })
            })
        )
      } else {
        // Cache First strategy for item lists - show cached data immediately, update in background
        event.respondWith(
          caches.match(request).then(cachedResponse => {
            // If we have cached data, return it immediately
            if (cachedResponse && !isCacheExpired(cachedResponse)) {
              // Update in background (Stale While Revalidate)
              fetch(request)
                .then(response => {
                  if (response.status === 200) {
                    const responseClone = response.clone()
                    caches.open(RUNTIME_CACHE).then(cache => {
                      cache.put(request, addCacheTimestamp(responseClone))
                    })
                  }
                })
                .catch(() => {
                  // Background update failed, but we still have cached data
                })
              
              return cachedResponse
            }

            // No cache or cache expired, try network first
            return fetch(request)
              .then(response => {
                if (response.status === 200) {
                  const responseClone = response.clone()
                  caches.open(RUNTIME_CACHE).then(cache => {
                    cache.put(request, addCacheTimestamp(responseClone))
                  })
                }
                return response
              })
              .catch(() => {
                // Network failed, return stale cache if available
                return cachedResponse || new Response('[]', { 
                  status: 200, 
                  headers: { 'Content-Type': 'application/json' } 
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
          .catch(error => {
            // For mutations, we can't use cache - return error
            return new Response(JSON.stringify({ error: 'Offline - changes cannot be saved' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            })
          })
      )
    }
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

// Helper function to check if URL is a data retrieval endpoint
function isDataRetrievalEndpoint(pathname: string): boolean {
  // Item-based endpoints (cache-friendly) - use Cache First strategy
  const isItemEndpoint = pathname.includes('/items') && (
    pathname.includes('grocery_list') ||
    pathname.includes('todo_list') ||
    pathname.includes('noise_tracking')
  )
  
  // User preferences endpoints (network-first for freshness) - use Network First strategy
  const isUserPreferencesEndpoint = pathname.includes('/user/preferences')
  
  return isItemEndpoint || isUserPreferencesEndpoint
}

// Helper function to check if cache is expired (30 minutes)
function isCacheExpired(response: Response): boolean {
  const cacheTimestamp = response.headers.get('sw-cache-timestamp')
  if (!cacheTimestamp) return false
  
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
        if (pathname.includes('grocery_list') && requestUrl.pathname.includes('grocery_list') ||
            pathname.includes('todo_list') && requestUrl.pathname.includes('todo_list') ||
            pathname.includes('noise_tracking') && requestUrl.pathname.includes('noise_tracking') ||
            pathname.includes('/user/preferences') && requestUrl.pathname.includes('/user/preferences')) {
          cache.delete(request)
        }
      })
    })
  })
}

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

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event)
  
  if (!event.data) {
    console.log('[SW] Push notification received but no data')
    return
  }

  try {
    const data = event.data.json()
    console.log('[SW] Push notification data:', data)
    
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
  console.log('[SW] Notification click received:', event)
  
  event.notification.close()
  
  const notificationData = event.notification.data || {}
  const action = event.action
  
  let urlToOpen = '/'
  
  if (notificationData.projectId) {
    urlToOpen = `/?project=${notificationData.projectId}`
  }
  
  if (notificationData.type === 'todo_added' && notificationData.todoId) {
    urlToOpen = `${urlToOpen}#todo-${notificationData.todoId}`
  }
  
  console.log('[SW] Opening URL:', urlToOpen)
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList: readonly Client[]) => {
      for (const client of clientList) {
        if (client.url === self.registration.scope + urlToOpen.slice(1) && 'focus' in client) {
          return (client as WindowClient).focus()
        }
      }
      
      for (const client of clientList) {
        if (client.url.startsWith(self.registration.scope) && 'navigate' in client) {
          (client as WindowClient).navigate(urlToOpen)
          return (client as WindowClient).focus()
        }
      }
      
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen)
      }
    })
  )
})

self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag)
})

export {}
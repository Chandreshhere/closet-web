// ClosetX Service Worker — v1
// Caches all local static assets on first load so subsequent visits are instant.
const CACHE = 'closetx-v1'
const PRECACHE = [
  '/',
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/4.jpg',
  '/favicon.svg',
  '/favicon.ico',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      // addAll is all-or-nothing; use individual catch so a missing asset
      // doesn't break the whole SW install.
      Promise.allSettled(PRECACHE.map((url) => c.add(url)))
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  // Only handle GET requests for same-origin or images/fonts
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Cache-first for local static files (images, fonts, icons)
  if (
    url.origin === self.location.origin &&
    (url.pathname.match(/\.(jpe?g|png|webp|svg|ico|woff2?|ttf|otf)$/) ||
      url.pathname === '/')
  ) {
    e.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(request, clone))
          }
          return res
        })
      )
    )
    return
  }

  // Network-first for JS/CSS (so updates land quickly)
  if (
    url.origin === self.location.origin &&
    url.pathname.match(/\.(js|css)$/)
  ) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(request, clone))
          }
          return res
        })
        .catch(() => caches.match(request))
    )
  }
})

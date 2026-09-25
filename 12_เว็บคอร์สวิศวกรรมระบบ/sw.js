// PERSONAL CODEX Service Worker — Production PWA Cache & Offline Engine
const CACHE_NAME = 'personal-codex-v1.0.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './personal-codex-course.html',
  './manifest.json',
  './codex-icon.svg',
  './codex-icon-192.png',
  './codex-icon-512.png',
  'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Personal Codex SW] Pre-caching offline assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Personal Codex SW] Some precache assets failed:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Personal Codex SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip WebSocket, local Python gateway, non-GET requests
  if (event.request.method !== 'GET' || url.protocol === 'ws:' || url.protocol === 'wss:' || url.port === '8080') {
    return;
  }

  // Network-first with cache fallback for HTML pages, cache-first for fonts & images
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((res) => res || caches.match('./index.html'));
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
            return response;
          }
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        });
      })
    );
  }
});

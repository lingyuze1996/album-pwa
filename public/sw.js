// // Improved service worker
// const CACHE_NAME = 'album-pwa-cache-v2';
// const ASSETS_TO_CACHE = ['/index.html', '/vite.svg', '/manifest.json'];

// // Install: pre-cache core assets
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
//   );
//   self.skipWaiting();
// });

// // Activate: cleanup old caches
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches
//       .keys()
//       .then((keys) =>
//         Promise.all(
//           keys.map((k) =>
//             k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()
//           )
//         )
//       )
//   );
//   self.clients.claim();
// });

// // Helper: network-first then cache fallback
// async function networkFirst(request) {
//   try {
//     const response = await fetch(request);
//     // put into cache for offline use (only for GET)
//     if (request.method === 'GET' && response && response.status === 200) {
//       const cache = await caches.open(CACHE_NAME);
//       cache.put(request, response.clone()).catch(() => {});
//     }
//     return response;
//   } catch (err) {
//     const cached = await caches.match(request);
//     if (cached) return cached;
//     throw err;
//   }
// }

// // Helper: cache-first then network fallback
// async function cacheFirst(request) {
//   const cached = await caches.match(request);
//   if (cached) return cached;
//   return fetch(request);
// }

// self.addEventListener('fetch', (event) => {
//   const req = event.request;
//   const url = new URL(req.url);

//   // Only handle same-origin requests; let other origins go through
//   if (url.origin !== location.origin) return;

//   // Navigation requests (page loads) — network-first, fallback to cached index.html
//   if (req.mode === 'navigate') {
//     event.respondWith(
//       (async () => {
//         try {
//           return await fetch(req);
//         } catch (err) {
//           return await caches.match('/index.html');
//         }
//       })()
//     );
//     return;
//   }

//   // For JS module scripts or files under /assets/ use network-first to avoid stale HTML fallback
//   if (
//     url.pathname.startsWith('/assets/') ||
//     req.destination === 'script' ||
//     req.destination === 'module'
//   ) {
//     event.respondWith(networkFirst(req));
//     return;
//   }

//   // For images/styles/fonts use cache-first for performance
//   if (
//     req.destination === 'image' ||
//     req.destination === 'style' ||
//     req.destination === 'font'
//   ) {
//     event.respondWith(cacheFirst(req));
//     return;
//   }

//   // Default: try cache first then network
//   event.respondWith(cacheFirst(req));
// });

// // Allow the page to force an update of the SW
// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });

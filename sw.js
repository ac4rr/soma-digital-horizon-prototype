/* Soma Digital — Horizon prototype service worker.
   Precaches the app shell so the prototype opens offline. */
const CACHE = 'soma-horizon-v2';
const FONT_CACHE = 'soma-horizon-fonts-v2';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png'
];

const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    // Fonts are nice-to-have offline; never fail the install over them.
    try {
      const fonts = await caches.open(FONT_CACHE);
      await fonts.add(FONT_CSS);
    } catch (e) { /* offline first install without fonts is fine */ }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k !== CACHE && k !== FONT_CACHE)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: cache-first into the font cache.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok) {
          const fonts = await caches.open(FONT_CACHE);
          fonts.put(req, res.clone());
        }
        return res;
      } catch (e) {
        return Response.error();
      }
    })());
    return;
  }

  if (url.origin !== location.origin) return;

  // Navigations: network first, shell fallback when offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', res.clone());
        return res;
      } catch (e) {
        return caches.match('./index.html');
      }
    })());
    return;
  }

  // Everything else same-origin: cache first.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone());
    }
    return res;
  })());
});

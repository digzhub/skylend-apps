
const CACHE_NAME = 'skylend-cache-v4';
const PRECACHE_MANIFEST = '/precache-manifest.json';
const FALLBACK = '/index.html';

async function readPrecacheList() {
  try {
    const r = await fetch(PRECACHE_MANIFEST, {cache: 'no-store'});
    if (!r.ok) return [];
    return await r.json();
  } catch (e) {
    return [];
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const toCache = new Set(await readPrecacheList());
    toCache.add(FALLBACK);
    toCache.add('/manifest.json');
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(Array.from(toCache).map(async (url) => {
      try {
        const resp = await fetch(url, {cache: 'no-store'});
        if (resp && resp.ok) await cache.put(url, resp.clone());
      } catch (e) {
        console.warn('failed to cache', url, e && e.message);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k === CACHE_NAME ? null : caches.delete(k)));
    await clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(req).catch(() => caches.match(FALLBACK)));
    return;
  }

  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(networkResp => {
          if (networkResp && networkResp.ok) {
            caches.open(CACHE_NAME).then(c => c.put(req, networkResp.clone()));
          }
          return networkResp;
        }).catch(() => caches.match(FALLBACK));
      })
    );
    return;
  }

  event.respondWith(caches.match(req).then(cached => {
    if (cached) return cached;
    return fetch(req).then(networkResp => {
      if (networkResp && networkResp.ok) {
        caches.open(CACHE_NAME).then(c => {
          try { c.put(req, networkResp.clone()); } catch (e) {}
        });
      }
      return networkResp;
    }).catch(() => caches.match(FALLBACK));
  }));
});

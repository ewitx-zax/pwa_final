// ============================
//   TECHSTORE — SERVICE-WORKER.JS
//   Base: /pwa_final/ (GitHub Pages)
// ============================

const CACHE_NAME = 'techstore-v2';
const BASE = '/pwa_final';

const urlsToCache = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/productos.html',
  BASE + '/ofertas.html',
  BASE + '/categorias.html',
  BASE + '/contacto.html',
  BASE + '/style.css',
  BASE + '/productos.css',
  BASE + '/ofertas.css',
  BASE + '/categorias.css',
  BASE + '/contacto.css',
  BASE + '/app.js',
  BASE + '/productos.js',
  BASE + '/ofertas.js',
  BASE + '/categorias.js',
  BASE + '/contacto.js',
  BASE + '/manifest.json'
];

/* ---- INSTALL: precachear todo ---- */
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando archivos');
        // addAll falla si UNO falla; usamos add individual para ser tolerantes
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(e => console.warn('[SW] No se pudo cachear:', url, e)))
        );
      })
  );
  self.skipWaiting();
});

/* ---- ACTIVATE: limpiar cachés viejos ---- */
self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Borrando caché viejo:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

/* ---- FETCH: Cache First, luego Red ---- */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Imágenes externas (Unsplash, Google Fonts): Network First
  if (url.hostname !== self.location.hostname) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Archivos locales: Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});

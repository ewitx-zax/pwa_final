// ============================
//   SERVICE WORKER - TECHSTORE
//   VERSIÓN: 2.0.0
// ============================

const CACHE_NAME = 'techstore-v2.0.0';

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/producto.html',
  '/ofertas.html',
  '/categorias.html',
  '/contacto.html',
  '/manifest.json',
  '/static.img/icon.png'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación - Limpia cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Estrategia Cache First con fallback a red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(fetchResponse => {
            return caches.open(CACHE_NAME)
              .then(cache => {
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, fetchResponse.clone());
                }
                return fetchResponse;
              });
          })
          .catch(() => {
            // Si falla todo, mostrar página de error
            return new Response('Error de conexión', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

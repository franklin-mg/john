const CACHE_NAME = 'fatla-ia-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
  'https://i.postimg.cc/1t1kgtyg/icono-app-fatla.png',
  'https://i.postimg.cc/nL5H37qJ/fraternidad.png'
];

// Instalación: Cachear archivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
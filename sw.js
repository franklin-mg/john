/**
 * Service Worker para Planeta FATLA - IA Generativa
 * Proporciona capacidades Offline y permite la instalación como PWA.
 */

const CACHE_NAME = 'fatla-ia-cache-v1';

// Lista de recursos esenciales para que la app funcione sin conexión
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
  'https://i.postimg.cc/1t1kgtyg/icono-app-fatla.png',
  'https://i.postimg.cc/nL5H37qJ/fraternidad.png'
];

// Evento de Instalación: Guarda los archivos en el caché del navegador
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Abriendo caché y guardando recursos...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de Activación: Elimina versiones antiguas del caché si existen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de búsqueda: Intenta obtener del servidor primero (Network First)
// Si no hay internet, sirve el contenido desde el caché.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

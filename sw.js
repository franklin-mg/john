/**
 * Planeta FATLA - Service Worker
 * Gestiona la carga offline y el almacenamiento en caché de recursos locales.
 */

const CACHE_NAME = 'fatla-ia-v2';

// Lista de recursos locales para precargar
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'icono-app-fatla.png',
  'fraternidad.png',
  'primavera.png',
  'verano.png',
  'otoño.png',
  'invierno.png',
  'winter.png'
];

// Evento de instalación: guarda los archivos en el caché del navegador
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Cacheando archivos locales...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Evento de activación: limpia versiones antiguas del caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia de respuesta: Cache First (Priorizar caché, si no existe buscar en red)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna el archivo del caché o realiza la petición a la red
      return response || fetch(event.request);
    })
  );
});

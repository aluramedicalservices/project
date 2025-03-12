self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pwa-cache').then(cache => {
      return cache.addAll([
        '/',                        // Página principal
        '/index.html',              // HTML
        '/icon-192x192.png',        // Ícono
        '/styles/app.css',          // CSS
        '/scripts/app.js',          // Aquí añades el JS compilado de Vue
        '/scripts/vendor.js',       // Si tienes otros archivos JS, agrégales también
        // Agrega más archivos estáticos si es necesario
      ]);
    })
  );
});

// Manejo del evento 'fetch' para responder con caché o red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open('pwa-cache').then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
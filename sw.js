// Bbee Co Kiosk - Service Worker v2
// This version clears all old caches

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        return caches.delete(k);
      }));
    }).then(function() {
      return clients.claim();
    })
  );
});

// No caching - always fetch fresh
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request).catch(function() {
    return new Response('');
  }));
});

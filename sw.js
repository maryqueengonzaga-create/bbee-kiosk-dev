// Bbee.Co Service Worker
// Update CACHE_VERSION every time you upload new files!
var CACHE_VERSION = 'bbee-v12';
var CACHE_NAME    = 'bbee-kiosk-' + CACHE_VERSION;

self.addEventListener('install', function(e) {
  // Force immediate activation — skip waiting
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // Delete ALL old caches immediately
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Network first — always try fresh from server first
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Cache the fresh response
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(function() {
        // Offline fallback — use cache
        return caches.match(e.request);
      })
  );
});

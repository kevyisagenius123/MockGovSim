// Service Worker for aggressive cache clearing - v2.1.2
const CACHE_NAME = 'mockgovsim-v2.1.2-20250614-071000';

// Clear all existing caches on install
self.addEventListener('install', (event) => {
  console.log('Service Worker installing - clearing all caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared, forcing immediate activation');
      return self.skipWaiting();
    })
  );
});

// Take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating - taking control');
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('Service Worker now controlling all clients');
      // Force reload all clients
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          console.log('Reloading client:', client.url);
          client.postMessage({ type: 'FORCE_RELOAD' });
        });
      });
    })
  );
});

// Intercept all fetch requests and bypass cache
self.addEventListener('fetch', (event) => {
  // For JavaScript and CSS files, always fetch fresh
  if (event.request.url.includes('.js') || event.request.url.includes('.css')) {
    console.log('Bypassing cache for:', event.request.url);
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
    );
  } else {
    // For other requests, use normal caching
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
}); 
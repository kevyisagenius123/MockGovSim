// NUCLEAR SERVICE WORKER for cache destruction - v2.1.2
const CACHE_NAME = 'mockgovsim-NUCLEAR-v2.1.2-' + Date.now();

console.log('💥 NUCLEAR SERVICE WORKER LOADING');

// IMMEDIATE cache destruction on install
self.addEventListener('install', (event) => {
  console.log('💥 NUCLEAR Service Worker installing - DESTROYING ALL CACHES');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('💥 Found caches to destroy:', cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('💥 NUKING cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('💥 ALL CACHES DESTROYED - SKIPPING WAITING');
      return self.skipWaiting();
    })
  );
});

// Take control immediately and force reload
self.addEventListener('activate', (event) => {
  console.log('💥 NUCLEAR Service Worker activating - TAKING CONTROL');
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('💥 NUCLEAR Service Worker controlling all clients');
      
      // Force reload ALL clients immediately
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          console.log('💥 FORCING NUCLEAR RELOAD of client:', client.url);
          client.postMessage({ 
            type: 'FORCE_RELOAD',
            timestamp: Date.now(),
            message: 'NUCLEAR CACHE CLEARING COMPLETE'
          });
        });
      });
    })
  );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('💥 SKIP_WAITING received - activating immediately');
    self.skipWaiting();
  }
});

// NUCLEAR fetch interception - bypass ALL caches
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // For ANY JavaScript or CSS files, ALWAYS fetch fresh with nuclear headers
  if (url.includes('.js') || url.includes('.css') || url.includes('main.jsx')) {
    console.log('💥 NUCLEAR BYPASS for:', url);
    
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }).then(response => {
        // Clone and add nuclear headers to response
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        newHeaders.set('Pragma', 'no-cache');
        newHeaders.set('Expires', '0');
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      }).catch(error => {
        console.error('💥 NUCLEAR fetch failed:', error);
        // Don't fallback to cache - force error
        throw error;
      })
    );
  } else {
    // For other requests, still bypass cache but allow fallback
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => {
        // Only fallback for non-JS/CSS files
        return caches.match(event.request);
      })
    );
  }
});

console.log('💥 NUCLEAR SERVICE WORKER READY FOR DESTRUCTION'); 
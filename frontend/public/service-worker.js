const CACHE_NAME = 'aviation-gps-v1.0.0';
const urlsToCache = [
  '/',
  '/pwa',
  '/index.html',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Background sync for offline GPS data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-gps-data') {
    event.waitUntil(syncGPSData());
  }
});

async function syncGPSData() {
  // Get pending GPS data from IndexedDB
  const db = await openDB();
  const pendingData = await db.getAll('pending-gps');
  
  // Send each item to server
  for (const data of pendingData) {
    try {
      await fetch('https://smallaviationmonitor-api.administrator-112.workers.dev/api/v1/gps/position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // Remove from pending after successful send
      await db.delete('pending-gps', data.id);
    } catch (error) {
      console.error('Failed to sync GPS data:', error);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('aviation-gps-db', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-gps')) {
        db.createObjectStore('pending-gps', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Define a cache name for your app's assets
const CACHE_NAME = 'max-spelling-cache';

// List of static assets to cache
const staticAssets = [
  '/',
  '/app.html',
  '/global.css',
  '/build/bundle.css',
  '/build/bundle.js',
  // Add more assets as needed
];

// Install the service worker and cache the static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(staticAssets);
    })
  );
});

// Serve cached assets when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Clean up old caches when a new service worker activates
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
    })
  );
});

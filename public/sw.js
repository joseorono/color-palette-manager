// Deferred service worker registration
// This file is intentionally minimal to keep it small and cacheable

// Workbox manifest injection point
self.__WB_MANIFEST;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handler - Workbox will handle the rest
});

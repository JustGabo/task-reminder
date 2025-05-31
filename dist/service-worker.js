const CACHE_NAME = 'homework-reminder-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  // Agrega más recursos si quieres cachear
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

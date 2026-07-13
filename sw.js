/**
 * sw.js — Service Worker
 * -----------------------------------------------------------------------
 * Met en cache les fichiers statiques essentiels afin que l'application
 * fonctionne hors ligne après une première visite (stratégie "cache-first"
 * avec repli réseau, puis mise à jour du cache en tâche de fond).
 * -----------------------------------------------------------------------
 */

const CACHE_NAME = "azkar-app-cache-v1";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/azkar.js",
  "./js/storage.js",
  "./js/audio.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Ne pas intercepter les requêtes vers des origines externes (polices, CDN)
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached); // hors ligne : repli sur le cache

      return cached || networkFetch;
    })
  );
});

const CACHE_NAME = "pomodoro_cache-837862";
const APP_PREFIX = "pomodoro_";
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/assets/css/styles.css",
    "/assets/js/app.js",
    "/assets/icons/icon-512x512.png"
];

// Install: Cache essential assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[Service Worker] Caching assets...");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate: Remove old caches with the same prefix
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith(APP_PREFIX) && name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    console.log("[Service Worker] Activated and old caches cleared.");
});

// Fetch: Serve from cache first, then update in the background
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Update cache in the background
                fetch(event.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});

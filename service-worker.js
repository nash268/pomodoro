const CACHE_NAME = "pomodoro-id-837862";
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/assets/css/styles.css",
    "/assets/js/app.js",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png"
];

// Install Service Worker and cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Service Worker and remove old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    console.log("Service Worker activated.");
});

// Fetch assets from cache or network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

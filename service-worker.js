const CACHE_NAME = "pomodoro-cache-313101";
const APP_PREFIX = "pomodoro_";
const ASSETS_TO_CACHE = [
    "/pomodoro/",
    "/pomodoro/index.html",
    "/pomodoro/manifest.json",
    "/pomodoro/assets/css/styles.css",
    "/pomodoro/assets/js/app.js",
    "/pomodoro/assets/icons/icon-192x192.png",
    "/pomodoro/assets/icons/icon-256x256.png",
    "/pomodoro/assets/icons/icon-512x512.png",
    "/pomodoro/assets/screenshots/screenshot-pixel.png",
    "/pomodoro/assets/audios/breaking-bad-celebration.mp3",
    "/pomodoro/assets/audios/jesse-time-to-cook.mp3",
    "/pomodoro/assets/audios/family-guy-singing-star-wars.mp3",
    "/pomodoro/assets/audios/hp-level-up-mario.mp3"
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

// Activate: Remove old caches and notify about updates
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name.startsWith(APP_PREFIX) && name !== CACHE_NAME) {
                        console.log(`[Service Worker] Deleting old cache: ${name}`);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => {
            // Notify clients about the update
            self.clients.matchAll().then((clients) => {
                clients.forEach(client => {
                    client.postMessage({ type: "UPDATE_AVAILABLE" });
                });
            });
        })
    );
    console.log("[Service Worker] Activated and old caches cleared.");
});

// Fetch: Network-first strategy
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request) // Try to fetch from the network first
            .then((networkResponse) => {
                // If the network request is successful, cache the response
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // If the network request fails, fall back to the cache
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || new Response("Offline fallback page"); // Provide a fallback if no cache is available
                });
            })
    );
});
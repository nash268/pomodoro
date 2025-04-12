const CACHE_NAME = "pomodoro-cache-789201";
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
	"/pomodoro/assets/audios/family-guy-singing-star-wars.mp3",
	"/pomodoro/assets/audios/hp-level-up-mario.mp3",
	"/pomodoro/assets/audios/nature-sounds-water-forest-crick.mp3",
	"/pomodoro/assets/audios/prime-facts7-nature-sound-birds.mp3",
];

// Install event - cache necessary assets
self.addEventListener("install", (event) => {
	console.log("Service Worker: Installing...");
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Service Worker: Caching assets");
			return cache.addAll(ASSETS_TO_CACHE);
		})
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	console.log("Service Worker: Activating...");
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== CACHE_NAME) {
						console.log("Service Worker: Deleting old cache", cache);
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

// Fetch event - serve cached content if offline
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				console.log("Service Worker: Serving from cache", event.request.url);
				return response;
			}
			console.log("Service Worker: Fetching from network", event.request.url);
			return fetch(event.request);
		})
	);
});

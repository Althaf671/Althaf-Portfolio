const CACHE_NAME = "althaf-portfolio";

const CORE_ASSETS = [
    "./",
    "./index.html",
    "./contact.html",
    "./capabilities.html",
    "./styles/style.css",
    "./scripts/main.js",
    "./scripts/helper.js",
    "./scripts/constants.js",
    "./scripts/animation.js",
    "./assets/poison-door-sister-of-mercy.mp3",
    "./assets/favicon.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            await Promise.all(
                CORE_ASSETS.map(async asset => {
                    try {
                        const response = await fetch(asset);

                        if (response.ok) {
                            await cache.put(asset, response);
                        } else {
                            console.warn(
                                `Gagal cache ${asset}: ${response.status}`
                            );
                        }
                    } catch (error) {
                        console.warn(`Gagal cache ${asset}:`, error);
                    }
                })
            );

            await self.skipWaiting();
        })()
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );

            await self.clients.claim();
        })()
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (
        request.method !== "GET" ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    event.respondWith(
        (async () => {
            const cachedResponse = await caches.match(request);

            if (cachedResponse) {
                return cachedResponse;
            }

            try {
                const response = await fetch(request);

                if (response.ok && response.type === "basic") {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }

                return response;
            } catch (error) {
                if (request.mode === "navigate") {
                    const offlinePage = await caches.match("./index.html");

                    if (offlinePage) {
                        return offlinePage;
                    }
                }

                return new Response("Kamu sedang offline.", {
                    status: 503,
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8"
                    }
                });
            }
        })()
    );
});
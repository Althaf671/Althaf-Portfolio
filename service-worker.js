const CACHE_NAME = "althaf-portfolio-v2"; 

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
    "./misc/data.json",
    "./assets/favicon.png"
];

const STATIC_EXT = /\.(png|jpe?g|svg|webp|mp3|woff2?)$/i;

self.addEventListener("install", event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await Promise.all(
                CORE_ASSETS.map(async asset => {
                    try {
                        const response = await fetch(asset, { cache: "reload" });
                        if (response.ok) await cache.put(asset, response);
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
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
            await self.clients.claim();
        })()
    );
});

const networkFirst = async request => {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request, { cache: "no-cache" });
        if (response.ok && response.type === "basic") {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) return cached;

        if (request.mode === "navigate") {
            const offlinePage = await cache.match("./index.html");
            if (offlinePage) return offlinePage;
        }

        return new Response("Kamu sedang offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
    }
};

const cacheFirst = async request => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone());
    }
    return response;
};

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    if (request.headers.has("range")) return;

    if (url.pathname.endsWith("/sw.js") || url.pathname.endsWith("/worker.js")) return;

    event.respondWith(
        STATIC_EXT.test(url.pathname) ? cacheFirst(request) : networkFirst(request)
    );
});
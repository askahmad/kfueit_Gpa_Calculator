/* =========================================================
   KFUEIT CGPA Calculator - Progressive Web App Service Worker
   Provides 100% Offline Capability, Asset Caching, and Fast Loading
   ========================================================= */

const CACHE_NAME = 'kfueit-cgpa-v1.1.0';

// Core assets to pre-cache immediately on install
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './images/icon-192.png',
    './images/icon-512.png',
    './images/icon-maskable.png',
    './images/favicon.png',
    './images/hero-banner.png',
    './sample_kfueit_transcript.pdf',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[ServiceWorker] Pre-caching offline assets');
            // Cache core local files first
            const localAssets = PRECACHE_ASSETS.filter(url => url.startsWith('.'));
            await cache.addAll(localAssets).catch(err => console.warn('[ServiceWorker] Local pre-cache warning:', err));
            
            // Try caching external CDN assets (non-blocking if offline during install)
            const cdnAssets = PRECACHE_ASSETS.filter(url => !url.startsWith('.'));
            await Promise.allSettled(
                cdnAssets.map(async (url) => {
                    try {
                        const response = await fetch(url, { mode: 'cors' });
                        if (response && response.ok) {
                            await cache.put(url, response);
                        }
                    } catch (e) {
                        console.warn('[ServiceWorker] Could not pre-cache CDN asset:', url, e);
                    }
                })
            );
        }).then(() => self.skipWaiting())
    );
});

// Activate Event: Clean up outdated caches & claim clients
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('[ServiceWorker] Removing legacy cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Cache-First Strategy with Network Fallback & Runtime Caching
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only handle GET requests
    if (request.method !== 'GET') return;

    // Do not intercept Chrome extensions or unsupported schemes
    if (!request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // If it's a cached response, optionally fetch in background for updates (stale-while-revalidate for local assets)
                if (request.url.startsWith(self.location.origin)) {
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, networkResponse);
                            });
                        }
                    }).catch(() => { /* Silent fail in background when offline */ });
                }
                return cachedResponse;
            }

            // Not in cache: fetch from network and dynamically cache
            return fetch(request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque' && !request.url.includes('google')) {
                    return networkResponse;
                }

                // Clone response to put into cache
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    // Only cache HTTP/HTTPS requests
                    if (request.url.startsWith('http')) {
                        cache.put(request, responseToCache);
                    }
                });

                return networkResponse;
            }).catch(() => {
                // Network failed (Offline)
                // If requesting an HTML navigation, serve cached index.html
                if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html') || caches.match('./');
                }
                // Return offline fallback or simple failure
                return new Response('Offline: Content currently unavailable', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                });
            });
        })
    );
});

var cacheName = 'Currency Converter';
var filesToCache = [
    '/',
    'index.html',
    'css/style.css',
    'scripts/script.js',
    'bg.jpg'
];

self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache){
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate',event => {
    event.waitUntil(
        caches.keys()
        .then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cName) {
                    if(cName !== cacheName){
                        return caches.delete(cName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request,{ignoreSearch:true})
        .then(response=>{
            return response || fetch(event.request);
        })
    );
});



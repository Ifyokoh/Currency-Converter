var cacheName = 'Currency Converter';
var filesToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/script.js',
    './bg.jpg'
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

self.addEventListener('activate', event => {
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

// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request,{ignoreSearch:true})
//         .then(response=>{
//             return response || fetch(event.request);
//         })
//     );
// });
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          var fetchRequest = event.request.clone();
          return fetch(fetchRequest).then(
            function(response) {
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              var responseToCache = response.clone();
              caches.open(cacheName)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
              return response;
            }
          );
        })
      );
  });


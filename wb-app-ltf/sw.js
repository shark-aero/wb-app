const staticCacheName = 'site-static-v1.5.0';
const assets = [
    './',
    './index.html',
    './about.html',
    './js/ui.js',
    './js/app.js',
    './js/graph.js',
    './js/vendor/nouislider.min.js',
    './js/vendor/d3.v6.min.js',
    './css/styles.css',
    './css/nouislider.min.css',
    './img/logo_shark.svg',
    './img/google-icons/caution.svg',
    './img/google-icons/warning.svg',
    './img/google-icons/airline_seat_recline_extra-24px.svg',
    './img/google-icons/local_gas_station-24px.svg',
    './img/google-icons/airplanemode_active-24px.svg',
    './img/google-icons/luggage-24px.svg',
    './img/google-icons/ballast-24px.svg',
];

// install event
self.addEventListener('install', evt => {
    console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    console.log('service worker activated');
    //remove old cache
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});

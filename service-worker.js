/* Cache léger du cœur de l'application. Les photos et vidéos restent en ligne. */
'use strict';

var CACHE_NAME = 'album-josiane-armand-v8';
var APP_FILES = [
  './',
  './index.html',
  './style.css?v=rsvp-20261030',
  './galerie.js',
  './site-content.js',
  './intelligence.js',
  './souvenirs.js',
  './presence.js',
  './script.js',
  './manifest.webmanifest',
  './icons/app-192.png',
  './icons/app-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(APP_FILES);
  }).then(function () {
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) {
      if (key.indexOf('album-josiane-armand-') === 0 && key !== CACHE_NAME) {
        return caches.delete(key);
      }
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  /* Évite de remplir le stockage du téléphone avec les photos, musiques et vidéos. */
  if (/\.(?:jpe?g|webp|png|gif|mp4|webm|mp3|ogg)$/i.test(url.pathname) && url.pathname.indexOf('/icons/') === -1) return;

  var indexURL = new URL('./index.html', self.registration.scope).href;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(function (response) {
      if (response && response.ok) {
        return caches.open(CACHE_NAME).then(function (cache) {
          return Promise.all([
            cache.put(request, response.clone()),
            cache.put(indexURL, response.clone())
          ]).then(function () { return response; });
        });
      }
      return response;
    }).catch(function () {
      return caches.match(request).then(function (saved) {
        return saved || caches.match(indexURL);
      });
    }));
    return;
  }

  event.respondWith(fetch(request).then(function (response) {
    if (!response || !response.ok) return response;
    return caches.open(CACHE_NAME).then(function (cache) {
      return cache.put(request, response.clone()).then(function () { return response; });
    });
  }).catch(function () {
    return caches.match(request);
  }));
});

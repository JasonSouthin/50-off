// // self.addEventListener('install', function(event) {
// //     console.log('[service worker] intalling service worker...', event);
// // })

// // self.addEventListener('activate', function(event) {
// //     console.log('[service worker] activating service worker...', event);
// //     return self.clients.claim();
// // })
// // importScripts('./ChabokSDKWorker.js', 'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
// console.log('hello');

// workbox.core.skipWaiting();
// workbox.core.clientsClaim();

// // // workbox.routing.registerRoute(
// // //   new RegExp('https://hacker-news.firebaseio.com'),
// // //   new workbox.strategies.StaleWhileRevalidate()
// // // );

// self.addEventListener('push', (event) => {
//   const title = 'Get Started With Workbox';
//   const options = {
//     body: event.data.text()
//   };
//   event.waitUntil(self.registration.showNotification(title, options));
// });

// // workbox.precaching.precacheAndRoute(self.__precacheManifest);

// // workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
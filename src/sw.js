importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([]);

}
else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  new RegExp('/app.js'),
  workbox.strategies.networkFirst()
);

// Test this later when I know stuff works
workbox.routing.registerRoute(
  new RegExp('/api'),
  workbox.strategies.networkFirst({
    // Use a custom cache for this route
    cacheName: 'api-cache',
    // Add an array of custom plugins (like workbox.expiration.Plugin)
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ]
  }),
  'POST'
);

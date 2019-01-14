importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([
  {
    "url": "app.js",
    "revision": "45c7a6b46be3c5260c3cf247f9f9ea44"
  },
  {
    "url": "index.html",
    "revision": "fcc2ad67ef3aade9929bf4b42d614e1c"
  },
  {
    "url": "javascript/helpers.js",
    "revision": "34cc8605bb74327403636f398ffeabd3"
  },
  {
    "url": "javascript/vue.js",
    "revision": "5424a463b58a5529d7a597974cf371d8"
  },
  {
    "url": "manifest.json",
    "revision": "26085ed5fd618c1b636e22da74b6f0ed"
  }
]);

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
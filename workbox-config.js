module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    // "**/*.{js,html,json,css}"
  ],
  "swDest": "public/sw.js",
  "swSrc": "./src/sw.js",
    "globIgnores": [
    "../workbox-config.js",
    "**/app.js"
  ]
};

const staticCacheName = "site-static-v1";
const cacheAssets = [
  "./",
  "./index.html",
  "./assets/css/style.css",
  "./assets/js/jquery.js",
  "./assets/js/script.js",
  "./assets/img/godown.png",
  "./assets/img/goup.png",
  "./assets/font/Shabnam-FD.ttf",
  "./assets/font/Shabnam-FD.woff",
  "./assets/font/Shabnam-Bold-FD.ttf",
  "./assets/font/Shabnam-Bold-FD.woff"
];

self.addEventListener("install", evt => {
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => {
        console.log("caching assets...");
        cache.addAll(cacheAssets);
      })
      .catch(err => {})
  );
});

self.addEventListener("fetch", evt => {
  evt.respondWith(
    caches
      .match(evt.request)
      .then(res => {
        return res || fetch(evt.request);
      })
      .catch(err => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("./index.html");
        }
      })
  );
});
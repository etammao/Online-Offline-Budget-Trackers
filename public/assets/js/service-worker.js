console.log(`Service worker is ready`)
// const FILES_TO_CACHE = ["/", "/index.html", "app.js", "favicon.ico"];

const CACHE_NAME = "budget-app-cache-v1"
const DATA_CACHE_NAME = "data-cache-v1"

var urltoCache = [
    "/",
    "/assets/js/db.js",
    "/assets/js/index.js",
    "/manifest.webmanifest",
    "/assets/styles.css",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png"
]

//install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then( cache => {
            console.log( "Open Cache" )
            return cache.addAll( urltoCache )
        })
    )
})

// fetch
self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
}

    event.respondWith(
        fetch( event.request ).catch( ()=> {
            return caches.match( event.request ).then( res => {
                if( res ){
                    return res
                } else if ( event.request.headers.get("accept").includes("text/html")){
                    return caches.match("/")
                }
            })
        })
    )
});
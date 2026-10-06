const CACHE="bc-truck-works-v1";
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(["/","/mobile","/manifest.webmanifest"]))));
self.addEventListener("fetch",event=>{ if(event.request.method==="GET") event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request))); });

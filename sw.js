/* Service worker — cachea la app para que abra sin internet.
   Los DATOS siempre van a Supabase por red; aquí solo cacheamos la
   "cáscara" de la app (HTML/CSS/JS/íconos). */

const CACHE = "finanzas-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./config.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Nunca cachear llamadas a Supabase ni a la librería externa: siempre red.
  if (url.hostname.includes("supabase.co") || url.hostname.includes("jsdelivr.net")) {
    return; // deja que el navegador maneje la red normalmente
  }
  // Para los archivos propios: primero caché, luego red (rápido y offline).
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});

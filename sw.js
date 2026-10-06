/* Salva la guida nel telefono (generato da genera_webapp.py: non si modifica a mano).
   Prima volta: copia tutti i file. Poi: risponde subito dalla copia e, se c'e' rete, la aggiorna per la volta dopo.
   Una versione nuova della guida ha un'impronta diversa: installa la sua copia e cancella le vecchie. */
const CACHE = 'farmaci-1.9-1e1f245c';
const FILE = [
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "apple-touch-icon.png",
  "img/allergie_02.jpg",
  "img/allergie_04.jpg",
  "img/allergie_05.jpg",
  "img/allergie_06.jpg",
  "img/allergie_07.jpg",
  "img/allergie_08.jpg",
  "img/allergie_09.jpg",
  "img/allergie_10.jpg",
  "img/allergie_11.jpg",
  "img/allergie_12.jpg",
  "img/convulsioni_02.jpg",
  "img/convulsioni_03.jpg",
  "img/convulsioni_04.jpg",
  "img/convulsioni_05.jpg",
  "img/convulsioni_06.jpg",
  "img/convulsioni_07.jpg",
  "img/ipoglicemia_03.jpg",
  "img/ipoglicemia_04.jpg",
  "img/ipoglicemia_05.jpg",
  "img/ipoglicemia_06.jpg",
  "img/ipoglicemia_07.jpg",
  "img/ipoglicemia_08.jpg",
  "img/ipoglicemia_09.jpg",
  "img/ipoglicemia_10.jpg",
  "img/ipoglicemia_11.jpg",
  "img/ipoglicemia_12.jpg",
  "img/ipoglicemia_13.jpg",
  "img/ipoglicemia_18.jpg"
];
const PAGINA = new URL('index.html', self.registration.scope).href;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(FILE.map(function (u) { return c.add(new Request(u, { cache: 'reload' })); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (nomi) {
    return Promise.all(nomi.filter(function (n) { return n.indexOf('farmaci-') === 0 && n !== CACHE; })
      .map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (url.origin !== location.origin) return;
  const chiave = r.mode === 'navigate' ? PAGINA : r.url;
  e.respondWith((async function () {
    const c = await caches.open(CACHE);
    const copia = await c.match(chiave);
    const rete = fetch(chiave === PAGINA ? PAGINA : r).then(function (res) {
      if (res && res.ok) c.put(chiave, res.clone());
      return res;
    }).catch(function () { return null; });
    if (copia) { e.waitUntil(rete); return copia; }
    return (await rete) || new Response('Non disponibile senza internet: apri la guida una volta con la rete.', { status: 503 });
  })());
});

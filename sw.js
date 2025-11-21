// Mudei o nome para garantir que o navegador baixe a nova versão 4.0
const CACHE_NAME = 'firework-master-v4';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

self.addEventListener('install', e => {
  // Força o SW a assumir o controle imediatamente
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => {
        // Apaga qualquer cache antigo que não seja o v4
        if (k !== CACHE_NAME) return caches.delete(k);
      }))
    )
  );
  // Garante que as abas abertas já usem o novo cache
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});

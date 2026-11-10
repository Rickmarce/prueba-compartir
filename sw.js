// Service worker de la PRUEBA (no es el de Partes LAV). Clásico, sin caché de la app:
// solo recibe lo compartido y lo apunta en una caché para que la página lo enseñe.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method === 'POST' && url.pathname.endsWith('/compartir')) {
    e.respondWith((async () => {
      try {
        const fotos = (await req.formData()).getAll('fotos');
        const cache = await caches.open('prueba-compartidas');
        const previas = await cache.match('lista');
        const lista = previas ? await previas.json() : [];
        fotos.forEach((f) => lista.push({ nombre: f.name, tipo: f.type, kb: Math.round(f.size / 1024), hora: new Date().toLocaleTimeString('es') }));
        await cache.put('lista', new Response(JSON.stringify(lista)));
      } catch (err) { /* la página lo notará porque no sale nada */ }
      return Response.redirect('./', 303);
    })());
  }
});

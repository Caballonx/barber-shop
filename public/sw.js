// Service Worker para BarberSaaS
// Maneja notificaciones push y cache para PWA

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'BarberSaaS 💈';
    const options = {
      body: data.body || 'Tienes una nueva notificación',
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/admin/appointments'
      },
      actions: [
        { action: "open", title: "Ver" },
        { action: "close", title: "Cerrar" },
      ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === "close") return;

  const targetUrl = event.notification.data?.url || '/admin/appointments';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si hay una ventana abierta con la misma URL o en el panel admin, enfócala
      for (let client of windowClients) {
        if ((client.url.includes(targetUrl) || client.url.includes('/admin')) && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abre una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

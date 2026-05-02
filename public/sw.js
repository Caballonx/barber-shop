self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'FADE Barbershop';
    const options = {
      body: data.body || 'Tienes una nueva notificación',
      icon: data.icon || '/icon-192x192.png', // Ensure this exists or use a default
      badge: data.badge || '/badge-72x72.png',
      data: data.url || '/',
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

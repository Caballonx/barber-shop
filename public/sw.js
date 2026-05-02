// Service Worker para FADE Barbershop
// Maneja notificaciones push y cache para PWA

// Push notification handler
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body || "",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: data.badge || "/icons/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/admin",
    },
    actions: [
      { action: "open", title: "Ver" },
      { action: "close", title: "Cerrar" },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title || "FADE Barbershop", options))
})

// Click en notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "close") return

  const url = event.notification.data?.url || "/admin"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes("/admin") && "focus" in client) {
          return client.focus()
        }
      }
      // Si no, abrir nueva ventana
      return clients.openWindow(url)
    })
  )
})

// Install — precache básico
self.addEventListener("install", (event) => {
  self.skipWaiting()
})

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
})

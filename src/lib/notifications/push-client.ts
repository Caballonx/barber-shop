"use client"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Solicita permiso de notificaciones y registra la suscripción push.
 * Solo se ejecuta en el navegador del admin.
 */
export async function registerPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("[Push Client] Push notifications no soportadas en este navegador")
    return
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn("[Push Client] VAPID_PUBLIC_KEY no configurada")
    return
  }

  try {
    // Registrar service worker
    const registration = await navigator.serviceWorker.register("/sw.js")
    console.log("[Push Client] Service Worker registrado")

    // Verificar permiso
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      console.warn("[Push Client] Permiso de notificaciones denegado")
      return
    }

    // Obtener o crear suscripción push
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }

      // Enviar suscripción al servidor con el formato correcto
      const sub = subscription.toJSON()
      const payload = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys?.p256dh,
          auth: sub.keys?.auth,
        },
      }

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

    console.log("[Push Client] Suscripción push registrada exitosamente")
  } catch (error) {
    console.error("[Push Client] Error registrando push:", error)
  }
}

import webpush from "web-push"
import { prisma } from "@/lib/db/prisma"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ""
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@fadebarbershop.com"

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

/**
 * Envía una notificación push a todos los admins suscritos.
 * No lanza error para no bloquear el flujo principal.
 */
export async function sendPushToAdmins(title: string, body: string, url?: string) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn("[Push] VAPID keys no configuradas. Notificación omitida.")
    return
  }

  try {
    const subscriptions = await prisma.pushSubscription.findMany()

    const payload = JSON.stringify({
      title,
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      url: url || "/admin",
    })

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          )
        } catch (error: any) {
          // Si el token expiró o es inválido, eliminarlo
          if (error.statusCode === 404 || error.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } })
            console.log(`[Push] Suscripción expirada eliminada: ${sub.id}`)
          }
          throw error
        }
      })
    )

    const sent = results.filter((r) => r.status === "fulfilled").length
    console.log(`[Push] ${sent}/${subscriptions.length} notificaciones enviadas`)
  } catch (error) {
    console.error("[Push] Error enviando notificaciones:", error)
  }
}

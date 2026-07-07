import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function POST(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId, userId } = auth

  try {
    const body = await request.json()
    const { endpoint, keys } = body

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Datos de suscripción inválidos" }, { status: 400 })
    }

    // Usar upsert para evitar errores de duplicados y mantener la base de datos limpia
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId,
        shopId,
        updatedAt: new Date(),
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId,
        shopId,
      },
    })

    return NextResponse.json({ message: "Suscripción procesada exitosamente" })
  } catch (error) {
    console.error("Error en suscripción push:", error)
    return NextResponse.json({ error: "Error al registrar notificaciones" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/authOptions"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
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
        userId: session?.user?.id || null,
        updatedAt: new Date(),
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session?.user?.id || null,
      },
    })

    return NextResponse.json({ message: "Suscripción procesada exitosamente" })
  } catch (error) {
    console.error("Error en suscripción push:", error)
    return NextResponse.json({ error: "Error al registrar notificaciones" }, { status: 500 })
  }
}

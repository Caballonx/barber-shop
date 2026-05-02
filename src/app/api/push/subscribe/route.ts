import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { endpoint, keys } = body

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Datos de suscripción inválidos" }, { status: 400 })
    }

    // Verificar si ya existe esta suscripción
    const existing = await prisma.pushSubscription.findFirst({
      where: { endpoint },
    })

    if (existing) {
      // Actualizar keys si cambiaron
      await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: { p256dh: keys.p256dh, auth: keys.auth },
      })
      return NextResponse.json({ message: "Suscripción actualizada" })
    }

    // Crear nueva suscripción
    await prisma.pushSubscription.create({
      data: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    })

    return NextResponse.json({ message: "Suscripción registrada" })
  } catch (error) {
    console.error("Error guardando suscripción push:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

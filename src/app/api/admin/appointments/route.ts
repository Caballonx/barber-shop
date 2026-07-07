import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { AppointmentStatus } from "@/generated/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function GET(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const appointments = await prisma.appointment.findMany({
      where: {
        shopId,
        ...(status && status !== "ALL" ? { status: status as AppointmentStatus } : {}),
      },
      include: {
        client: true,
        barber: true,
        service: true
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const body = await request.json()
    const { id, status } = body

    const result = await prisma.appointment.updateMany({
      where: { id, shopId },
      data: { status }
    })
    if (result.count === 0) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    const updated = await prisma.appointment.findUnique({ where: { id } })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

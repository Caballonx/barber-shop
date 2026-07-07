import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Estado es requerido" }, { status: 400 })
    }

    const existing = await prisma.appointment.findFirst({ where: { id, shopId } })
    if (!existing) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        client: true,
        barber: true,
        service: true,
      }
    })

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment status:", error)
    return NextResponse.json(
      { error: "Error al actualizar el estado de la cita" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Estado es requerido" }, { status: 400 })
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

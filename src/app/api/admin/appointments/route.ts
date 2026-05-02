import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    
    const appointments = await prisma.appointment.findMany({
      where: status ? { status: status as any } : {},
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
  try {
    const body = await request.json()
    const { id, status } = body

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const barbers = await prisma.barber.findMany({
      where: { isActive: true },
    })
    
    return NextResponse.json(barbers)
  } catch (error) {
    console.error("Error fetching barbers:", error)
    return NextResponse.json(
      { error: "Error al obtener los barberos" },
      { status: 500 }
    )
  }
}

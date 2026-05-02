import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    let config = await prisma.shopConfig.findUnique({
      where: { id: "default" }
    })

    if (!config) {
      // Crear configuración inicial si no existe
      config = await prisma.shopConfig.create({
        data: { id: "default" }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Error al obtener ajustes" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    const config = await prisma.shopConfig.upsert({
      where: { id: "default" },
      update: {
        shopName: body.shopName,
        contactEmail: body.contactEmail,
        address: body.address,
        openingTime: body.openingTime,
        closingTime: body.closingTime,
        autoConfirm: body.autoConfirm,
      },
      create: {
        id: "default",
        shopName: body.shopName,
        contactEmail: body.contactEmail,
        address: body.address,
        openingTime: body.openingTime,
        closingTime: body.closingTime,
        autoConfirm: body.autoConfirm,
      }
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Error al actualizar ajustes" }, { status: 500 })
  }
}

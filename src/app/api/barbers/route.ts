import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getShopBySlug } from "@/lib/shops"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shop = await getShopBySlug(searchParams.get("shop") ?? "")
    if (!shop) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }
    if (shop.subscriptionStatus === "SUSPENDED") {
      return NextResponse.json({ error: "SUSPENDED" }, { status: 403 })
    }

    const barbers = await prisma.barber.findMany({
      where: { shopId: shop.id, isActive: true },
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

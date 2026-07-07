import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function GET() {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } })
    if (!shop) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }
    // Alias shopName para compatibilidad con el UI existente
    return NextResponse.json({ ...shop, shopName: shop.name })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Error al obtener ajustes" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const body = await request.json()

    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        name: body.shopName ?? body.name ?? undefined,
        contactEmail: body.contactEmail ?? undefined,
        contactPhone: body.contactPhone ?? undefined,
        address: body.address ?? undefined,
        openingTime: body.openingTime ?? undefined,
        closingTime: body.closingTime ?? undefined,
        autoConfirm: body.autoConfirm ?? undefined,
      }
    })

    return NextResponse.json({ ...shop, shopName: shop.name })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Error al actualizar ajustes" }, { status: 500 })
  }
}

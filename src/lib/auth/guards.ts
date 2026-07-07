import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { prisma } from "@/lib/db/prisma"

export type ShopAdminContext = {
  userId: string
  shopId: string
}

/**
 * Guard para endpoints /api/admin/*: exige sesión de SHOP_ADMIN con tienda
 * activa. Devuelve el contexto o un NextResponse de error listo para retornar.
 */
export async function requireShopAdmin(): Promise<ShopAdminContext | NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  const { role, shopId, id } = session.user
  if (role !== "SHOP_ADMIN" || !shopId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  const shop = await prisma.shop.findUnique({ where: { id: shopId } })
  if (!shop) {
    return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
  }
  if (shop.subscriptionStatus === "SUSPENDED") {
    return NextResponse.json({ error: "SUSPENDED" }, { status: 403 })
  }
  return { userId: id, shopId }
}

export type SuperAdminContext = { userId: string }

/** Guard para endpoints /api/super/*: exige sesión de SUPER_ADMIN. */
export async function requireSuperAdmin(): Promise<SuperAdminContext | NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  return { userId: session.user.id }
}

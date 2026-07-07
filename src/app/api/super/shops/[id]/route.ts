import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireSuperAdmin } from "@/lib/auth/guards"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()

    const shop = await prisma.shop.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        contactEmail: body.contactEmail ?? undefined,
        contactPhone: body.contactPhone ?? undefined,
        address: body.address ?? undefined,
        openingTime: body.openingTime ?? undefined,
        closingTime: body.closingTime ?? undefined,
        autoConfirm: body.autoConfirm ?? undefined,
        subscriptionStatus: body.subscriptionStatus ?? undefined,
      }
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Error updating shop:", error)
    return NextResponse.json({ error: "Error al actualizar la tienda" }, { status: 500 })
  }
}

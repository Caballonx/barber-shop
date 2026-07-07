import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function GET() {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const services = await prisma.service.findMany({
      where: { shopId },
      orderBy: { order: "asc" }
    })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const body = await request.json()
    const service = await prisma.service.create({
      data: {
        shopId,
        name: body.name,
        description: body.description,
        price: parseInt(body.price),
        duration: parseInt(body.duration),
        category: body.category || "General",
        isActive: true
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const body = await request.json()
    const { id, ...data } = body
    const result = await prisma.service.updateMany({
      where: { id, shopId },
      data: {
        ...data,
        price: data.price ? parseInt(data.price) : undefined,
        duration: data.duration ? parseInt(data.duration) : undefined,
      }
    })
    if (result.count === 0) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }
    const service = await prisma.service.findUnique({ where: { id } })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

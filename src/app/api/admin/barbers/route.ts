import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function GET() {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const barbers = await prisma.barber.findMany({ where: { shopId } })
    return NextResponse.json(barbers)
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
    const barber = await prisma.barber.create({
      data: {
        shopId,
        name: body.name,
        specialty: body.specialty,
        bio: body.bio,
        photoUrl: body.photoUrl,
        startTime: body.startTime || "09:00",
        endTime: body.endTime || "20:00",
        workDays: body.workDays || ["LUN","MAR","MIE","JUE","VIE","SAB"],
        isActive: true
      }
    })
    return NextResponse.json(barber)
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
    const result = await prisma.barber.updateMany({
      where: { id, shopId },
      data
    })
    if (result.count === 0) {
      return NextResponse.json({ error: "Barbero no encontrado" }, { status: 404 })
    }
    const barber = await prisma.barber.findUnique({ where: { id } })
    return NextResponse.json(barber)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

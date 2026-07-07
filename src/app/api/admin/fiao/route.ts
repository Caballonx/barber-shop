import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function GET() {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const debts = await prisma.debt.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(debts)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch debts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const body = await request.json()
    const { clientName, serviceName, amount, notes } = body

    if (!clientName || !serviceName || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const debt = await prisma.debt.create({
      data: {
        shopId,
        clientName,
        serviceName,
        amount: parseInt(amount.toString()),
        notes,
        isPaid: false
      }
    })

    return NextResponse.json(debt)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create debt" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const body = await request.json()
    const { id, isPaid } = body

    const result = await prisma.debt.updateMany({
      where: { id, shopId },
      data: { isPaid }
    })
    if (result.count === 0) {
      return NextResponse.json({ error: "Deuda no encontrada" }, { status: 404 })
    }

    const debt = await prisma.debt.findUnique({ where: { id } })
    return NextResponse.json(debt)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update debt" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const result = await prisma.debt.deleteMany({ where: { id, shopId } })
    if (result.count === 0) {
      return NextResponse.json({ error: "Deuda no encontrada" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete debt" }, { status: 500 })
  }
}

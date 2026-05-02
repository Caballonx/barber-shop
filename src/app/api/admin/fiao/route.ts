import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const debts = await prisma.debt.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(debts)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch debts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientName, serviceName, amount, notes } = body

    if (!clientName || !serviceName || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const debt = await prisma.debt.create({
      data: {
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
  try {
    const body = await request.json()
    const { id, isPaid } = body

    const debt = await prisma.debt.update({
      where: { id },
      data: { isPaid }
    })

    return NextResponse.json(debt)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update debt" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await prisma.debt.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete debt" }, { status: 500 })
  }
}

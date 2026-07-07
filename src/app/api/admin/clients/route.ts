import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function GET() {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const clients = await prisma.client.findMany({
      where: { shopId },
      include: {
        _count: {
          select: { appointments: true }
        },
        appointments: {
          orderBy: { date: 'desc' },
          take: 1,
          select: { date: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    const formattedClients = clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      totalAppointments: client._count.appointments,
      lastVisit: client.appointments[0]?.date || null,
      createdAt: client.createdAt
    }))

    return NextResponse.json(formattedClients)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching clients" }, { status: 500 })
  }
}

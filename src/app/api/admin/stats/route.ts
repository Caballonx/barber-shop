import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format, eachDayOfInterval } from "date-fns"

export async function GET() {
  try {
    const today = new Date()
    const startOfToday = startOfDay(today)
    const endOfToday = endOfDay(today)
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 })
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 })

    // 1. Stats for cards
    const [citasHoy, ingresosHoy, nuevosClientes, totalCitas] = await Promise.all([
      prisma.appointment.count({
        where: { date: { gte: startOfToday, lte: endOfToday } }
      }),
      prisma.appointment.aggregate({
        where: { 
          date: { gte: startOfToday, lte: endOfToday },
          status: { in: ["CONFIRMED", "COMPLETED"] }
        },
        _sum: { price: true }
      }),
      prisma.client.count({
        where: { createdAt: { gte: startOfCurrentWeek } }
      }),
      prisma.appointment.count()
    ])

    // 2. Weekly revenue chart
    const daysInWeek = eachDayOfInterval({
      start: startOfCurrentWeek,
      end: endOfCurrentWeek
    })

    const weeklyRevenue = await Promise.all(
      daysInWeek.map(async (day) => {
        const dayStart = startOfDay(day)
        const dayEnd = endOfDay(day)
        const revenue = await prisma.appointment.aggregate({
          where: {
            date: { gte: dayStart, lte: dayEnd },
            status: { in: ["CONFIRMED", "COMPLETED"] }
          },
          _sum: { price: true }
        })
        
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
        return {
          name: dayNames[day.getDay()],
          ingresos: revenue._sum.price || 0
        }
      })
    )

    // 3. Service distribution
    const serviceDistribution = await prisma.appointment.groupBy({
      by: ['serviceId'],
      _count: { id: true },
    })

    const services = await prisma.service.findMany({
      where: { id: { in: serviceDistribution.map(s => s.serviceId) } }
    })

    const pieData = serviceDistribution.map(item => {
      const service = services.find(s => s.id === item.serviceId)
      return {
        name: service?.name || 'Otro',
        value: item._count.id
      }
    })

    // 4. Today's appointments
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        date: { gte: startOfToday, lte: endOfToday }
      },
      include: {
        client: true,
        barber: true,
        service: true
      },
      orderBy: { startTime: 'asc' }
    })

    return NextResponse.json({
      summary: {
        citasHoy,
        ingresosHoy: ingresosHoy._sum.price || 0,
        nuevosClientes,
        rating: 5.0 // Placeholder
      },
      weeklyRevenue,
      serviceData: pieData,
      todayAppointments
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

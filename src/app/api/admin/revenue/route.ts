import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfDay, endOfDay } from "date-fns"
import { es } from "date-fns/locale"

export async function GET() {
  try {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // 1. Ingresos por día del mes actual
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: 'COMPLETED'
      },
      include: { service: true }
    })

    const dailyRevenue = days.map(day => {
      const dayStr = format(day, "dd")
      const dayTotal = appointments
        .filter(a => format(new Date(a.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
        .reduce((sum, a) => sum + (a.price || 0), 0)
      
      return {
        name: dayStr,
        ingresos: dayTotal
      }
    })

    // 2. Ingresos por categoría de servicio
    const categoryRevenueMap: Record<string, number> = {}
    appointments.forEach(a => {
      const cat = a.service.category || "Otros"
      categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + (a.price || 0)
    })

    const categoryRevenue = Object.entries(categoryRevenueMap).map(([name, value]) => ({
      name,
      value
    }))

    // 3. Resumen general del mes
    const totalMonth = appointments.reduce((sum, a) => sum + (a.price || 0), 0)
    const avgTicket = appointments.length > 0 ? totalMonth / appointments.length : 0

    return NextResponse.json({
      dailyRevenue,
      categoryRevenue,
      summary: {
        totalMonth,
        avgTicket,
        count: appointments.length
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching revenue data" }, { status: 500 })
  }
}

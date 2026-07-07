import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from "date-fns"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function GET() {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)

    // Obtener todas las citas completadas del mes actual
    const appointments = await prisma.appointment.findMany({
      where: {
        shopId,
        status: "COMPLETED",
        date: {
          gte: start,
          lte: end,
        }
      },
      include: {
        service: true
      }
    })

    // 1. Total Mes Actual
    const totalRevenue = appointments.reduce((sum, app) => sum + app.price, 0)
    const completedCount = appointments.length

    // 2. Ticket Promedio
    const averageTicket = completedCount > 0 ? Math.round(totalRevenue / completedCount) : 0

    // 3. Ingresos Diarios (para la gráfica)
    const daysInMonth = eachDayOfInterval({ start, end })
    const dailyRevenue = daysInMonth.map(day => {
      const dayTotal = appointments
        .filter(app => isSameDay(new Date(app.date), day))
        .reduce((sum, app) => sum + app.price, 0)

      return {
        date: format(day, "dd"),
        amount: dayTotal
      }
    })

    // 4. Por Categoría
    const categoryMap: Record<string, number> = {}
    appointments.forEach(app => {
      const cat = app.service.category || "General"
      categoryMap[cat] = (categoryMap[cat] || 0) + app.price
    })

    const categoryRevenue = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }))

    return NextResponse.json({
      totalRevenue,
      completedCount,
      averageTicket,
      dailyRevenue,
      categoryRevenue
    })
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return NextResponse.json({ error: "Error al obtener datos de ingresos" }, { status: 500 })
  }
}

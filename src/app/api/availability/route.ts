import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { parse, addMinutes, isBefore, isAfter, format, isEqual, startOfDay, endOfDay, getDay } from "date-fns"

// Helper: Convierte un día numérico a cadena (0 = DOM, 1 = LUN, etc.)
const dayToString: Record<number, string> = {
  0: "DOM", 1: "LUN", 2: "MAR", 3: "MIE", 4: "JUE", 5: "VIE", 6: "SAB"
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date") // Formato YYYY-MM-DD
    const barberId = searchParams.get("barberId")
    const serviceId = searchParams.get("serviceId")

    if (!dateParam || !barberId || !serviceId) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 })
    }

    const date = new Date(dateParam)
    const dayName = dayToString[getDay(date)]

    // Obtener datos del barbero y servicio en paralelo
    const [barber, service] = await Promise.all([
      prisma.barber.findUnique({ where: { id: barberId } }),
      prisma.service.findUnique({ where: { id: serviceId } })
    ])

    if (!barber || !service) {
      return NextResponse.json({ error: "Barbero o servicio no encontrado" }, { status: 404 })
    }

    // Verificar si el barbero trabaja en ese día de la semana
    if (!barber.workDays.includes(dayName)) {
      return NextResponse.json({ availableSlots: [] })
    }

    // Obtener citas y bloques para ese día
    const [appointments, blockedSlots] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          barberId,
          date: {
            gte: startOfDay(date),
            lte: endOfDay(date)
          },
          status: {
            notIn: ["CANCELLED", "NO_SHOW"]
          }
        }
      }),
      prisma.blockedSlot.findMany({
        where: {
          barberId,
          date: {
            gte: startOfDay(date),
            lte: endOfDay(date)
          }
        }
      })
    ])

    const slots: string[] = []
    
    // Convertir horas del barbero a objetos Date en el día solicitado
    const workStart = parse(barber.startTime, "HH:mm", date)
    const workEnd = parse(barber.endTime, "HH:mm", date)
    const serviceDuration = service.duration

    // Intervalo para generar slots (cada 30 min por ejemplo)
    const INTERVAL = 30 
    let currentSlot = workStart

    // Asegurarnos de no mostrar slots en el pasado si es hoy
    const now = new Date()

    while (isBefore(currentSlot, workEnd)) {
      const slotEnd = addMinutes(currentSlot, serviceDuration)

      // Si el servicio termina después de la hora de salida, no es un slot válido
      if (isAfter(slotEnd, workEnd)) {
        break
      }

      // Si la fecha es hoy y la hora ya pasó, saltar
      if (isEqual(startOfDay(date), startOfDay(now)) && isBefore(currentSlot, now)) {
        currentSlot = addMinutes(currentSlot, INTERVAL)
        continue
      }

      // Verificar superposición con citas existentes
      const overlapsAppointment = appointments.some(app => {
        const appStart = parse(app.startTime, "HH:mm", date)
        const appEnd = parse(app.endTime, "HH:mm", date)
        return (isBefore(currentSlot, appEnd) && isAfter(slotEnd, appStart))
      })

      // Verificar superposición con bloques manuales
      const overlapsBlock = blockedSlots.some(block => {
        const blockStart = parse(block.startTime, "HH:mm", date)
        const blockEnd = parse(block.endTime, "HH:mm", date)
        return (isBefore(currentSlot, blockEnd) && isAfter(slotEnd, blockStart))
      })

      if (!overlapsAppointment && !overlapsBlock) {
        slots.push(format(currentSlot, "HH:mm"))
      }

      currentSlot = addMinutes(currentSlot, INTERVAL)
    }

    return NextResponse.json({ availableSlots: slots })

  } catch (error) {
    console.error("Error validando disponibilidad:", error)
    return NextResponse.json(
      { error: "Error interno al validar disponibilidad" },
      { status: 500 }
    )
  }
}

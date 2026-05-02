import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { appointmentSchema } from "@/lib/validations/schemas"
import { parse, addMinutes, format } from "date-fns"
import { sendWhatsAppConfirmation } from "@/lib/notifications/whatsapp"
import { sendPushToAdmins } from "@/lib/notifications/push"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // El frontend enviará los datos del cliente separados o combinados.
    // Extraemos: clientData, appointmentData
    const { clientData, ...appointmentData } = body

    // 1. Validar que el servicio y barbero existen
    const [barber, service] = await Promise.all([
      prisma.barber.findUnique({ where: { id: appointmentData.barberId } }),
      prisma.service.findUnique({ where: { id: appointmentData.serviceId } })
    ])

    if (!barber || !service) {
      return NextResponse.json({ error: "Barbero o servicio inválido" }, { status: 400 })
    }

    // Calcular el endTime basado en la duración del servicio
    const startTimeDate = parse(appointmentData.startTime, "HH:mm", new Date())
    const endTimeDate = addMinutes(startTimeDate, service.duration)
    const endTime = format(endTimeDate, "HH:mm")

    // TODO: Aquí se podría volver a llamar la lógica de disponibilidad para evitar "double booking"
    // en milisegundos de diferencia, o usar una transacción de prisma.
    
    // 2. Manejar el Cliente
    let clientId = appointmentData.clientId
    if (!clientId && clientData?.phone) {
      // Buscar cliente por teléfono
      let client = await prisma.client.findFirst({
        where: { phone: clientData.phone }
      })

      if (!client) {
        // Crear cliente nuevo
        client = await prisma.client.create({
          data: {
            name: clientData.name,
            phone: clientData.phone,
            email: clientData.email || null,
          }
        })
      } else if (client.name !== clientData.name || client.email !== clientData.email) {
        // Opcional: Actualizar datos del cliente si cambiaron
        client = await prisma.client.update({
          where: { id: client.id },
          data: {
            name: clientData.name,
            email: clientData.email || client.email,
          }
        })
      }
      clientId = client.id
    }

    if (!clientId) {
      return NextResponse.json({ error: "Se requieren datos del cliente" }, { status: 400 })
    }

    // 3. Crear la Cita
    const dateObj = new Date(appointmentData.date)

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        barberId: barber.id,
        serviceId: service.id,
        date: dateObj,
        startTime: appointmentData.startTime,
        endTime: endTime,
        status: "PENDING",
        notes: appointmentData.notes || null,
        price: service.price,
      }
    })

    // 4. Notificar (No bloqueante)
    const formattedDate = format(dateObj, "dd/MM/yyyy")
    
    // Notificación WhatsApp al cliente
    sendWhatsAppConfirmation({
      clientPhone: clientData.phone,
      clientName: clientData.name,
      barberName: barber.name,
      serviceName: service.name,
      date: formattedDate,
      time: appointmentData.startTime,
      price: service.price
    })

    // Notificación Push al admin
    sendPushToAdmins(
      "Nueva cita registrada 💈",
      `${clientData.name} reservó ${service.name} con ${barber.name} para las ${appointmentData.startTime}`,
      "/admin/appointments"
    )

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json(
      { error: "Error al procesar la cita" },
      { status: 500 }
    )
  }
}

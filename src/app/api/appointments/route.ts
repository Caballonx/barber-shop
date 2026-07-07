import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { parse, addMinutes, format } from "date-fns"
import { sendWhatsAppConfirmation } from "@/lib/notifications/whatsapp"
import { sendPushToAdmins } from "@/lib/notifications/push"
import { getShopBySlug } from "@/lib/shops"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // El frontend envía: shopSlug, clientData y los datos de la cita
    const { shopSlug, clientData, ...appointmentData } = body

    const shop = await getShopBySlug(shopSlug ?? "")
    if (!shop) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }
    if (shop.subscriptionStatus === "SUSPENDED") {
      return NextResponse.json({ error: "SUSPENDED" }, { status: 403 })
    }

    // 1. Validar que el servicio y barbero existen y pertenecen a esta tienda
    const [barber, service] = await Promise.all([
      prisma.barber.findFirst({ where: { id: appointmentData.barberId, shopId: shop.id } }),
      prisma.service.findFirst({ where: { id: appointmentData.serviceId, shopId: shop.id } })
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

    // 2. Manejar el Cliente (único por tienda + teléfono)
    let clientId = appointmentData.clientId
    if (!clientId && clientData?.phone) {
      let client = await prisma.client.findUnique({
        where: { shopId_phone: { shopId: shop.id, phone: clientData.phone } }
      })

      if (!client) {
        client = await prisma.client.create({
          data: {
            shopId: shop.id,
            name: clientData.name,
            phone: clientData.phone,
            email: clientData.email || null,
          }
        })
      } else if (client.name !== clientData.name || client.email !== clientData.email) {
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
        shopId: shop.id,
        clientId,
        barberId: barber.id,
        serviceId: service.id,
        date: dateObj,
        startTime: appointmentData.startTime,
        endTime: endTime,
        status: shop.autoConfirm ? "CONFIRMED" : "PENDING",
        notes: appointmentData.notes || null,
        price: service.price,
      }
    })

    // 4. Notificar (No bloqueante)
    const formattedDate = format(dateObj, "dd/MM/yyyy")

    // Notificación WhatsApp al cliente
    sendWhatsAppConfirmation({
      shopName: shop.name,
      clientPhone: clientData.phone,
      clientName: clientData.name,
      barberName: barber.name,
      serviceName: service.name,
      date: formattedDate,
      time: appointmentData.startTime,
      price: service.price
    })

    // Notificación Push a los admins de esta tienda
    sendPushToAdmins(
      shop.id,
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

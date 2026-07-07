import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_WHATSAPP_FROM // formato: whatsapp:+14155238886

/**
 * Envía un mensaje de confirmación de cita por WhatsApp.
 * No lanza error para no bloquear la creación de la cita si falla.
 */
export async function sendWhatsAppConfirmation({
  shopName,
  clientPhone,
  clientName,
  barberName,
  serviceName,
  date,
  time,
  price,
}: {
  shopName: string
  clientPhone: string
  clientName: string
  barberName: string
  serviceName: string
  date: string
  time: string
  price: number
}) {
  if (!accountSid || !authToken || !fromNumber) {
    console.warn("[WhatsApp] Credenciales de Twilio no configuradas. Notificación omitida.")
    return
  }

  try {
    const client = twilio(accountSid, authToken)

    // Formatear el número del cliente para WhatsApp
    let phone = clientPhone.replace(/[^0-9+]/g, "")
    if (!phone.startsWith("+")) {
      // Asumir República Dominicana (+1) si no tiene código de país
      phone = "+1" + phone
    }

    const message = await client.messages.create({
      from: fromNumber,
      to: `whatsapp:${phone}`,
      body: `✅ *${shopName}* - Cita Confirmada\n\n` +
        `Hola *${clientName}*! Tu cita ha sido registrada:\n\n` +
        `💈 *Servicio:* ${serviceName}\n` +
        `👤 *Barbero:* ${barberName}\n` +
        `📅 *Fecha:* ${date}\n` +
        `🕐 *Hora:* ${time}\n` +
        `💰 *Precio:* RD$${price.toLocaleString()}\n\n` +
        `Te esperamos! 🔥`,
    })

    console.log(`[WhatsApp] Mensaje enviado: ${message.sid}`)
  } catch (error) {
    console.error("[WhatsApp] Error enviando notificación:", error)
    // No relanzar — la cita se crea de todos modos
  }
}

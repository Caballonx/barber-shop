import { NextResponse } from "next/server"
import { sendPushToAdmins } from "@/lib/notifications/push"
import { requireShopAdmin } from "@/lib/auth/guards"

export async function POST(request: Request) {
  const auth = await requireShopAdmin()
  if (auth instanceof NextResponse) return auth
  const { shopId } = auth

  try {
    const body = await request.json()
    const { title, body: message, url } = body

    if (!title || !message) {
      return NextResponse.json({ error: "Título y mensaje son requeridos" }, { status: 400 })
    }

    await sendPushToAdmins(shopId, title, message, url)

    return NextResponse.json({ message: "Notificación enviada" })
  } catch (error) {
    console.error("Error enviando notificación:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

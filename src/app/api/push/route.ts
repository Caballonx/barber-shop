import { NextResponse } from "next/server"
import { notifyAdmins } from "@/lib/notifications"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/authOptions"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { title, body: message, url } = body

    if (!title || !message) {
      return NextResponse.json({ error: "Título y mensaje son requeridos" }, { status: 400 })
    }

    await notifyAdmins({ title, body: message, url })

    return NextResponse.json({ message: "Notificación enviada" })
  } catch (error) {
    console.error("Error enviando notificación:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

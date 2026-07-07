import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireSuperAdmin } from "@/lib/auth/guards"
import bcrypt from "bcryptjs"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const admins = await prisma.user.findMany({
      where: { shopId: id },
      select: { id: true, email: true, name: true, role: true }
    })
    return NextResponse.json(admins)
  } catch (error) {
    console.error("Error fetching shop admins:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// Crea un admin para la tienda, o resetea la contraseña si el email ya es admin de esta tienda
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: "email y password son requeridos" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const shop = await prisma.shop.findUnique({ where: { id } })
    if (!shop) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      if (existing.shopId !== id) {
        return NextResponse.json({ error: "Ese email pertenece a otra tienda" }, { status: 409 })
      }
      const user = await prisma.user.update({
        where: { email },
        data: { password: hashed, name: name ?? undefined }
      })
      return NextResponse.json({ id: user.id, email: user.email, name: user.name })
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || `Administrador ${shop.name}`,
        role: "SHOP_ADMIN",
        shopId: id,
      }
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (error) {
    console.error("Error creating shop admin:", error)
    return NextResponse.json({ error: "Error al crear el admin" }, { status: 500 })
  }
}

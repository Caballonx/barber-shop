import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireSuperAdmin } from "@/lib/auth/guards"
import bcrypt from "bcryptjs"

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export async function GET() {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const shops = await prisma.shop.findMany({
      include: {
        _count: {
          select: { appointments: true, barbers: true, clients: true, users: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(shops)
  } catch (error) {
    console.error("Error fetching shops:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { slug, name, contactEmail, contactPhone, address, admin } = body

    if (!slug || !name) {
      return NextResponse.json({ error: "slug y name son requeridos" }, { status: 400 })
    }
    if (!SLUG_RE.test(slug) || ["admin", "super", "api"].includes(slug)) {
      return NextResponse.json({ error: "Slug inválido (solo minúsculas, números y guiones)" }, { status: 400 })
    }

    const existing = await prisma.shop.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Ya existe una tienda con ese slug" }, { status: 409 })
    }
    if (admin?.email) {
      const userExists = await prisma.user.findUnique({ where: { email: admin.email } })
      if (userExists) {
        return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 })
      }
      if (!admin.password || admin.password.length < 6) {
        return NextResponse.json({ error: "La contraseña del admin debe tener al menos 6 caracteres" }, { status: 400 })
      }
    }

    const shop = await prisma.$transaction(async (tx) => {
      const shop = await tx.shop.create({
        data: { slug, name, contactEmail, contactPhone, address }
      })
      if (admin?.email) {
        await tx.user.create({
          data: {
            email: admin.email,
            password: await bcrypt.hash(admin.password, 10),
            name: admin.name || `Administrador ${name}`,
            role: "SHOP_ADMIN",
            shopId: shop.id,
          }
        })
      }
      return shop
    })

    return NextResponse.json(shop, { status: 201 })
  } catch (error) {
    console.error("Error creating shop:", error)
    return NextResponse.json({ error: "Error al crear la tienda" }, { status: 500 })
  }
}

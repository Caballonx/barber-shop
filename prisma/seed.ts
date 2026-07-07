import { PrismaClient } from "../src/generated/prisma"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })
dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const WORK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

async function seedShop(opts: {
  slug: string
  name: string
  adminEmail: string
  barbers: { name: string; specialty: string }[]
  services: { name: string; price: number; duration: number; category: string }[]
}) {
  const shop = await prisma.shop.upsert({
    where: { slug: opts.slug },
    update: {},
    create: {
      slug: opts.slug,
      name: opts.name,
      contactEmail: `contacto@${opts.slug}.com`,
      subscriptionStatus: "ACTIVE",
    },
  })

  const hashedPassword = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: opts.adminEmail },
    update: { shopId: shop.id, role: "SHOP_ADMIN" },
    create: {
      email: opts.adminEmail,
      password: hashedPassword,
      name: `Administrador ${opts.name}`,
      role: "SHOP_ADMIN",
      shopId: shop.id,
    },
  })

  for (const b of opts.barbers) {
    const exists = await prisma.barber.findFirst({ where: { shopId: shop.id, name: b.name } })
    if (!exists) {
      await prisma.barber.create({
        data: {
          ...b,
          shopId: shop.id,
          workDays: WORK_DAYS,
          startTime: "09:00",
          endTime: "20:00",
        },
      })
    }
  }

  for (const [i, s] of opts.services.entries()) {
    const exists = await prisma.service.findFirst({ where: { shopId: shop.id, name: s.name } })
    if (!exists) {
      await prisma.service.create({ data: { ...s, shopId: shop.id, order: i } })
    }
  }

  console.log(`Shop lista: ${opts.slug} (admin: ${opts.adminEmail} / admin123)`)
}

async function main() {
  // Super admin del SaaS
  const hashed = await bcrypt.hash("super123", 10)
  await prisma.user.upsert({
    where: { email: "super@barbersaas.com" },
    update: { role: "SUPER_ADMIN", shopId: null },
    create: { email: "super@barbersaas.com", password: hashed, name: "Super Admin", role: "SUPER_ADMIN" },
  })
  console.log("SUPER_ADMIN: super@barbersaas.com / super123")

  await seedShop({
    slug: "fade",
    name: "FADE Barbershop",
    adminEmail: "admin@fade.com",
    barbers: [
      { name: "Carlos Pérez", specialty: "Fades y diseños" },
      { name: "Luis Gómez", specialty: "Barba y afeitado clásico" },
    ],
    services: [
      { name: "Corte clásico", price: 500, duration: 30, category: "Cortes" },
      { name: "Fade completo", price: 700, duration: 45, category: "Cortes" },
      { name: "Barba", price: 300, duration: 30, category: "Barba" },
    ],
  })

  await seedShop({
    slug: "luxe",
    name: "LUXE Barber Club",
    adminEmail: "admin@luxe.com",
    barbers: [{ name: "Miguel Santos", specialty: "Estilos modernos" }],
    services: [
      { name: "Corte premium", price: 900, duration: 45, category: "Cortes" },
      { name: "Afeitado con toalla caliente", price: 600, duration: 30, category: "Barba" },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

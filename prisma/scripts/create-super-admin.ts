// Crea (o promueve) el usuario SUPER_ADMIN del dueño del SaaS.
// Uso: npx tsx prisma/scripts/create-super-admin.ts <email> <password> [nombre]
import { PrismaClient } from "../../src/generated/prisma"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })
dotenv.config()

const [email, password, name = "Super Admin"] = process.argv.slice(2)
if (!email || !password) {
  console.error("Uso: npx tsx prisma/scripts/create-super-admin.ts <email> <password> [nombre]")
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "SUPER_ADMIN", shopId: null, password: hashed },
    create: { email, password: hashed, name, role: "SUPER_ADMIN" },
  })
  console.log("SUPER_ADMIN listo:", user.email)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

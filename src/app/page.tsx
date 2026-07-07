import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import { Scissors, CalendarCheck, Smartphone, BarChart3 } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "BarberSaaS | Sistema de reservas para barberías",
  description: "Sistema completo de reservas y gestión para barberías.",
}

export default async function Home() {
  const shops = await prisma.shop.findMany({
    where: { subscriptionStatus: { not: "SUSPENDED" } },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="border-b border-[#22c55e]/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tighter text-white">
            Barber<span className="text-[#22c55e]">SaaS</span>
          </span>
          <Link
            href="/admin/login"
            className="text-sm font-semibold text-[#22c55e] border border-[#22c55e]/30 px-4 py-2 rounded-md hover:bg-[#22c55e]/10 transition-colors"
          >
            Acceso barberías
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          El sistema de reservas<br />para tu <span className="text-[#22c55e]">barbería</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
          Reservas en línea, agenda de barberos, control de ingresos y notificaciones
          automáticas. Todo en un solo lugar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-24">
          {[
            { icon: CalendarCheck, label: "Reservas 24/7" },
            { icon: Scissors, label: "Gestión de barberos" },
            { icon: BarChart3, label: "Reportes de ingresos" },
            { icon: Smartphone, label: "Notificaciones WhatsApp" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 text-gray-300">
              <Icon className="w-8 h-8 text-[#22c55e]" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        {shops.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Barberías disponibles</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {shops.map((shop) => (
                <Link
                  key={shop.slug}
                  href={`/${shop.slug}`}
                  className="bg-[#111] border border-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:border-[#22c55e]/50 transition-colors"
                >
                  {shop.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BarberSaaS
      </footer>
    </div>
  )
}

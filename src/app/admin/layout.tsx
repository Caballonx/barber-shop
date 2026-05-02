import { ReactNode } from "react"
import Link from "next/link"
import { Calendar, Users, Scissors, DollarSign, Settings, LayoutDashboard, CreditCard } from "lucide-react"
import { LogoutButton } from "@/components/ui/LogoutButton"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Citas", href: "/admin/appointments", icon: Calendar },
  { name: "FIAO", href: "/admin/fiao", icon: CreditCard },
  { name: "Barberos", href: "/admin/barbers", icon: Scissors },
  { name: "Servicios", href: "/admin/services", icon: Scissors },
  { name: "Clientes", href: "/admin/clients", icon: Users },
  { name: "Ingresos", href: "/admin/revenue", icon: DollarSign },
  { name: "Ajustes", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#22c55e]/20 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#22c55e]/20">
          <Link href="/admin" className="text-xl font-bold tracking-wider">
            FADE<span className="text-[#22c55e]">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#22c55e]/10 text-gray-300 hover:text-[#22c55e] transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-[#22c55e]/20">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-[#111111] border-b border-[#22c55e]/20 flex items-center px-4 md:hidden">
          <span className="text-xl font-bold tracking-wider">
            FADE<span className="text-[#22c55e]">ADMIN</span>
          </span>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

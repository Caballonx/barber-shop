"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, Scissors, DollarSign, Settings, LayoutDashboard, CreditCard, ChevronRight } from "lucide-react"
import { LogoutButton } from "@/components/ui/LogoutButton"
import { NotificationToggle } from "@/components/features/notifications/NotificationToggle"
import { cn } from "@/lib/utils"

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
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white font-sans selection:bg-[#22c55e]/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f0f0f] border-r border-white/5 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/admin" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              FADE<span className="text-[#22c55e] transition-colors group-hover:text-[#22c55e]/80">ADMIN</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-[#22c55e]/10 text-[#22c55e]" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-[#22c55e]" : "text-gray-500 group-hover:text-gray-300"
                    )} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4 bg-[#0d0d0d]/50 backdrop-blur-sm">
          <NotificationToggle />
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-[#0f0f0f] border-b border-white/5 flex items-center justify-between px-6 md:hidden">
          <span className="text-xl font-bold tracking-tight">
            FADE<span className="text-[#22c55e]">ADMIN</span>
          </span>
          <NotificationToggle isMobile />
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#111] via-[#0a0a0a] to-[#0a0a0a]">
          <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

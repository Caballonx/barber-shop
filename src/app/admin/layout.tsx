"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, Scissors, DollarSign, Settings, LayoutDashboard, CreditCard, Menu, X } from "lucide-react"
import { LogoutButton } from "@/components/ui/LogoutButton"
import { useEffect } from "react"
import { registerPushNotifications } from "@/lib/notifications/push-client"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Solo intentar registrar en el cliente (navegador)
    if (typeof window !== "undefined") {
      registerPushNotifications()
    }
  }, [])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#22c55e]/20 hidden md:flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#22c55e]/20">
          <Link href="/admin" className="text-xl font-bold tracking-wider">
            FADE<span className="text-[#22c55e]">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  active
                    ? "bg-[#22c55e]/15 text-[#22c55e] font-semibold"
                    : "text-gray-300 hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
                }`}
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

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#111111] border-r border-[#22c55e]/20 z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#22c55e]/20">
          <Link href="/admin" className="text-xl font-bold tracking-wider" onClick={() => setMobileMenuOpen(false)}>
            FADE<span className="text-[#22c55e]">ADMIN</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  active
                    ? "bg-[#22c55e]/15 text-[#22c55e] font-semibold"
                    : "text-gray-300 hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
                }`}
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
        <header className="h-16 bg-[#111111] border-b border-[#22c55e]/20 flex items-center justify-between px-4 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-[#22c55e] transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold tracking-wider">
            FADE<span className="text-[#22c55e]">ADMIN</span>
          </span>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

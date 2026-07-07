"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Scissors, 
  DollarSign, 
  Settings, 
  LayoutDashboard, 
  CreditCard, 
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { LogoutButton } from "@/components/ui/LogoutButton"
import { NotificationToggle } from "@/components/features/notifications/NotificationToggle"
import { registerPushNotifications } from "@/lib/notifications/push-client"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shopName, setShopName] = useState("")
  const [suspended, setSuspended] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      registerPushNotifications()
    }
    fetch("/api/admin/settings")
      .then(async (res) => {
        if (res.status === 403) {
          const data = await res.json().catch(() => null)
          if (data?.error === "SUSPENDED") setSuspended(true)
          return null
        }
        return res.ok ? res.json() : null
      })
      .then((data) => {
        if (data?.shopName) setShopName(data.shopName)
      })
      .catch(() => {})
  }, [])

  if (suspended) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4 text-white">
        <span className="text-5xl mb-6">💈</span>
        <h1 className="text-2xl font-bold mb-4">Cuenta suspendida</h1>
        <p className="text-gray-400 max-w-md mb-8">
          El acceso al panel está suspendido temporalmente. Contacta al proveedor del
          sistema para reactivar tu suscripción.
        </p>
        <LogoutButton />
      </div>
    )
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white font-sans selection:bg-[#22c55e]/30">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-[#0f0f0f] border-r border-white/5 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/admin" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              {shopName || "Mi Barbería"}<span className="text-[#22c55e] transition-colors group-hover:text-[#22c55e]/80"></span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                    active 
                      ? "bg-[#22c55e]/10 text-[#22c55e]" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                      active ? "text-[#22c55e]" : "text-gray-500 group-hover:text-gray-300"
                    )} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {active && (
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

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-[#0f0f0f] border-r border-white/10 z-50 flex flex-col transform transition-transform duration-300 md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/5">
          <span className="text-xl font-bold tracking-tight text-white">
            {shopName || "Mi Barbería"}
          </span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-8 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    active
                      ? "bg-[#22c55e]/10 text-[#22c55e]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
        <div className="p-6 border-t border-white/5 space-y-4 bg-[#0d0d0d]/50">
          <NotificationToggle />
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Mobile Header */}
        <header className="h-16 bg-[#0f0f0f] border-b border-white/5 flex items-center justify-between px-6 md:hidden sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-[#22c55e] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold tracking-tight text-white">
            {shopName || "Mi Barbería"}
          </span>
          <NotificationToggle isMobile />
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#111] via-[#0a0a0a] to-[#0a0a0a] custom-scrollbar">
          <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

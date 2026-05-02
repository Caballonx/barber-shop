"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-red-400 hover:bg-red-400/10 transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span className="font-medium">Cerrar Sesión</span>
    </button>
  )
}

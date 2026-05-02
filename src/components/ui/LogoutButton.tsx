"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-200 border border-transparent hover:border-red-400/20"
    >
      <div className="p-2 rounded-lg bg-red-400/5 group-hover:bg-red-400/10 transition-colors">
        <LogOut className="w-4 h-4" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold leading-tight">Cerrar Sesión</span>
        <span className="text-[10px] text-red-400/60 font-medium uppercase tracking-wider">Finalizar jornada</span>
      </div>
    </button>
  )
}

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Scissors } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError("Credenciales inválidas")
      setLoading(false)
    } else {
      // Usar window.location para asegurar que la sesión se actualice correctamente
      window.location.href = "/admin"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="w-full max-w-md p-8 bg-[#111111] rounded-xl border border-[#22c55e]/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#22c55e]/10 rounded-full flex items-center justify-center mb-4 border border-[#22c55e]/30">
            <Scissors className="w-8 h-8 text-[#22c55e]" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">
            FADE<span className="text-[#22c55e]">ADMIN</span>
          </h1>
          <p className="text-gray-400 mt-2">Inicia sesión para gestionar la barbería</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#22c55e]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-white placeholder-gray-500"
              placeholder="admin@fadebarbershop.do"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#22c55e]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-white placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-4 bg-[#22c55e] hover:bg-[#22c55e]/90 text-black font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Entrar al Panel"}
          </button>
        </form>
      </div>
    </div>
  )
}

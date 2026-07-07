import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"

export const metadata = {
  title: "Super Admin | BarberSaaS",
}

export default async function SuperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#22c55e]/20 bg-[#111111]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tighter">
            Barber<span className="text-[#22c55e]">SaaS</span>
            <span className="ml-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Super Admin</span>
          </span>
          <span className="text-sm text-gray-400">{session.user.email}</span>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

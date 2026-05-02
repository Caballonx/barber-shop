import type { Metadata } from "next"
import AdminClientLayout from "./AdminClientLayout"

export const metadata: Metadata = {
  title: "FADE Barbershop | Admin Dashboard",
  description: "Panel de administración operativo para FADE Barbershop.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FADE Admin",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>
}

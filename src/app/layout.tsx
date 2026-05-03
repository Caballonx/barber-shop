import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FADE Barbershop | Tu Mejor Look",
  description: "Reserva tu cita fácil y rápido. Elige tu servicio, tu barbero y el horario que mejor te convenga.",
  manifest: "/manifest.json",
}

export const viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
}

import { PWARegistration } from "@/components/features/pwa/PWARegistration"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <PWARegistration />
        {children}
      </body>
    </html>
  )
}

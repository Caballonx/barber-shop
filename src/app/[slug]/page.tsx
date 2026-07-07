import Link from "next/link"
import { notFound } from "next/navigation"
import { Phone, Clock, MapPin, ShieldCheck, CheckCircle2, BellRing, Zap } from "lucide-react"
import { BookingWidget } from "@/components/features/BookingWidget"
import { HeroCarousel } from "@/components/ui/HeroCarousel"
import { ScrollToTop } from "@/components/ui/ScrollToTop"
import { getShopBySlug } from "@/lib/shops"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) return { title: "Barbería no encontrada" }
  return {
    title: `${shop.name} | Reserva tu cita`,
    description: `Reserva tu cita en ${shop.name} de forma rápida y fácil.`,
  }
}

export default async function ShopPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)

  if (!shop) notFound()

  if (shop.subscriptionStatus === "SUSPENDED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-center px-4">
        <span className="text-5xl mb-6">💈</span>
        <h1 className="text-3xl font-black text-white mb-4">{shop.name}</h1>
        <p className="text-gray-400 max-w-md">
          Las reservas en línea no están disponibles temporalmente. Por favor contacta
          directamente a la barbería.
        </p>
      </div>
    )
  }

  const whatsappLink = shop.contactPhone
    ? `https://wa.me/${shop.contactPhone.replace(/[^0-9]/g, "")}`
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#22c55e]/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter">
              {shop.name}<span className="text-[#22c55e]">.</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="#reserva" className="hover:text-[#22c55e] transition-colors">Reservar</Link>
            <Link href="#contacto" className="hover:text-[#22c55e] transition-colors">Contacto</Link>
          </nav>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#22c55e]/10 text-[#22c55e] px-4 py-2 rounded-md font-semibold hover:bg-[#22c55e]/20 transition-colors border border-[#22c55e]/30 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-16">
          <HeroCarousel />

          <div className="bg-[#0a0a0a] relative z-10 -mt-8 pt-8">
            <div className="container mx-auto px-4">
              {/* Trust badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
                <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                  <Zap className="w-5 h-5 text-[#22c55e]" />
                  <span>Rápido y fácil</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                  <span>Confirmación WhatsApp</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                  <BellRing className="w-5 h-5 text-[#22c55e]" />
                  <span>Recordatorios automáticos</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                  <ShieldCheck className="w-5 h-5 text-[#22c55e]" />
                  <span>Seguro y confiable</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WIDGET DE RESERVA */}
        <section id="reserva" className="py-24 px-4 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">HAZ TU RESERVA</h2>
              <p className="text-gray-400">Selecciona el servicio y la fecha que prefieras.</p>
            </div>
            <BookingWidget shop={{ id: shop.id, slug: shop.slug, name: shop.name }} />
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="py-24 px-4 bg-[#111111] border-t border-[#22c55e]/10">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">UBÍCANOS</h2>
              <p className="text-gray-400">Vive la experiencia premium de {shop.name}.</p>
            </div>

            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-gray-800 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#22c55e]" /> Contacto Directo
              </h3>
              <ul className="space-y-6 text-gray-400 text-lg">
                {shop.address && (
                  <li className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-[#22c55e]" /> {shop.address}
                  </li>
                )}
                {shop.contactPhone && (
                  <li className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-[#22c55e]" /> {shop.contactPhone}
                  </li>
                )}
                <li className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-[#22c55e]" /> {shop.openingTime} - {shop.closingTime}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#22c55e]/20 bg-[#0a0a0a] pt-12 pb-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {shop.name}. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

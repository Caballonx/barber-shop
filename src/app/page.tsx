import Link from "next/link"
import { Calendar, Phone, Clock, MapPin, ChevronRight, ShieldCheck, CheckCircle2, BellRing, Zap } from "lucide-react"
import { BookingWidget } from "@/components/features/BookingWidget"
import { HeroCarousel } from "@/components/ui/HeroCarousel"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#22c55e]/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter">
              FADE<span className="text-[#22c55e]">.</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="#servicios" className="hover:text-[#22c55e] transition-colors">Servicios</Link>
            <Link href="#barberos" className="hover:text-[#22c55e] transition-colors">Barberos</Link>
            <Link href="#galeria" className="hover:text-[#22c55e] transition-colors">Galería</Link>
            <Link href="#contacto" className="hover:text-[#22c55e] transition-colors">Contacto</Link>
          </nav>
          <a 
            href="https://wa.me/18095553274" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#22c55e]/10 text-[#22c55e] px-4 py-2 rounded-md font-semibold hover:bg-[#22c55e]/20 transition-colors border border-[#22c55e]/30 text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
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

        {/* STATS SECTION */}
        <section className="border-y border-[#22c55e]/10 bg-[#111111]">
          <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">+1,200</div>
              <div className="text-sm text-[#22c55e] font-medium tracking-wider uppercase">Clientes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1 flex items-center justify-center gap-1">
                4.9 <Star className="w-6 h-6 text-[#22c55e] fill-[#22c55e]" />
              </div>
              <div className="text-sm text-[#22c55e] font-medium tracking-wider uppercase">Calificación</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">+3,500</div>
              <div className="text-sm text-[#22c55e] font-medium tracking-wider uppercase">Citas</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">3</div>
              <div className="text-sm text-[#22c55e] font-medium tracking-wider uppercase">Años Exp.</div>
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
            <BookingWidget />
          </div>
        </section>

        {/* SERVICIOS PREVIEW */}
        <section id="servicios" className="py-24 px-4 bg-[#111111] border-y border-[#22c55e]/10">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-12">NUESTROS SERVICIOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Corte Clásico', price: 'RD$500', desc: 'Precisión y estilo intemporal.' },
                { title: 'Barba Premium', price: 'RD$400', desc: 'Toallas calientes y perfilado a navaja.' },
                { title: 'Combo Fade', price: 'RD$800', desc: 'Corte moderno + barba completa.' }
              ].map((s, i) => (
                <div key={i} className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-lg hover:border-[#22c55e]/50 transition-colors">
                  <h3 className="text-2xl font-bold mb-2 text-white">{s.title}</h3>
                  <p className="text-[#22c55e] font-bold text-xl mb-4">{s.price}</p>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BARBEROS PREVIEW */}
        <section id="barberos" className="py-24 px-4 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-12">EL EQUIPO FADE</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Jean Carlos', role: 'Especialista en Fade' },
                { name: 'Luis El Fino', role: 'Barbero Clásico' },
                { name: 'Marcos VIP', role: 'Estilista Urbano' }
              ].map((b, i) => (
                <div key={i} className="p-6 bg-[#111] border border-gray-800 rounded-lg">
                  <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl">💈</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-white">{b.name}</h3>
                  <p className="text-[#22c55e] text-sm">{b.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALERÍA */}
        <section id="galeria" className="py-24 px-4 bg-[#111] border-y border-[#22c55e]/10">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-12">NUESTRO TRABAJO</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80",
                "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
                "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80",
                "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80"
              ].map((img, i) => (
                <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <img src={img} alt={`Galería ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTO, MAPA Y EXPERIENCIA AI */}
        <section id="contacto" className="py-24 px-4 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">UBÍCANOS</h2>
              <p className="text-gray-400">Vive la verdadera experiencia premium FADE.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* MINIMAPA CON BORDE DE BARBERÍA */}
              <div className="relative p-3 rounded-2xl animate-pulse" style={{
                background: 'repeating-linear-gradient(45deg, #ef4444 0px, #ef4444 20px, #ffffff 20px, #ffffff 40px, #3b82f6 40px, #3b82f6 60px, #ffffff 60px, #ffffff 80px)',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.15), 0 0 30px rgba(59, 130, 246, 0.15)'
              }}>
                <div className="bg-[#0a0a0a] p-2 rounded-xl w-full h-[400px] overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15137.91501170757!2d-69.94056!3d18.4631399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89ee98bbd7b1%3A0x6b4fb4cb21319c5b!2sPiantini%2C%20Santo%20Domingo!5e0!3m2!1sen!2sdo!4v1700000000000!5m2!1sen!2sdo" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, borderRadius: '8px', filter: 'invert(90%) hue-rotate(180deg)' }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* DETALLES DE CONTACTO */}
              <div className="flex flex-col justify-center h-full">
                <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                  <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-[#22c55e]" /> Contacto Directo
                  </h3>
                  <ul className="space-y-6 text-gray-400 text-lg">
                    <li className="flex items-center gap-4">
                      <MapPin className="w-6 h-6 text-[#22c55e]" /> Winston Churchill 1206, Piantini
                    </li>
                    <li className="flex items-center gap-4">
                      <Phone className="w-6 h-6 text-[#22c55e]" /> +1 (809) 555-3274
                    </li>
                    <li className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-[#22c55e]" /> Lunes - Sábado: 9:00 AM - 8:00 PM
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#22c55e]/20 bg-[#0a0a0a] pt-16 pb-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <span className="text-2xl font-black tracking-tighter mb-4 block">
              FADE<span className="text-[#22c55e]">.</span>
            </span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevando el estándar de la barbería en Santo Domingo. Tu imagen es nuestra prioridad.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Horarios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between"><span>Lunes - Sábado</span> <span>9:00 AM - 8:00 PM</span></li>
              <li className="flex justify-between text-[#22c55e]"><span>Domingo</span> <span>Cerrado</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#22c55e]" /> Winston Churchill 1206</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#22c55e]" /> +1 (809) 555-3274</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-[#22c55e]">Términos y Condiciones</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 pt-8 border-t border-gray-800">
          © {new Date().getFullYear()} FADE Barbershop. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

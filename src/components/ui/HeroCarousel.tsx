"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    type: "video",
    src: "/videos/hero_video.mp4",
    title: "The FADE Experience",
    subtitle: "Ambiente de primer nivel diseñado para ti."
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop",
    title: "Atención Premium",
    subtitle: "Una experiencia completa de relajación."
  }
]

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  )

  const handleScrollToBooking = () => {
    const section = document.getElementById("reserva");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full relative"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] w-full overflow-hidden">
              {slide.type === "video" ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                  src={slide.src}
                />
              ) : slide.type === "ai-video" ? (
                <img 
                  src={slide.src}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover scale-110 animate-[kenburns_15s_ease-in-out_infinite_alternate]"
                  style={{ animation: 'kenburns 15s ease-in-out infinite alternate' }}
                />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out hover:scale-105"
                  style={{ backgroundImage: `url(${slide.src})` }}
                />
              )}
              <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
              
              {/* STYLE INJECTION FOR KENBURNS */}
              {slide.type === "ai-video" && (
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes kenburns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.15) translate(-1%, -1%); }
                  }
                `}} />
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-lg"
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <button 
                    onClick={handleScrollToBooking}
                    className="bg-[#22c55e] text-black px-8 py-3 rounded-md font-semibold hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    Reserva Ahora
                  </button>
                </motion.div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-8 right-8 flex gap-2">
        <CarouselPrevious className="relative static bg-black/50 border-[#22c55e]/50 text-white hover:bg-[#22c55e] hover:text-black" />
        <CarouselNext className="relative static bg-black/50 border-[#22c55e]/50 text-white hover:bg-[#22c55e] hover:text-black" />
      </div>
    </Carousel>
  )
}

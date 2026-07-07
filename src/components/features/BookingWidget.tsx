"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, Clock, Scissors, User, CheckCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

type Step = 1 | 2 | 3 | 4

export type BookingShop = {
  id: string
  slug: string
  name: string
}

export function BookingWidget({ shop }: { shop: BookingShop }) {
  const [step, setStep] = useState<Step>(1)
  
  // Data state
  const [services, setServices] = useState<any[]>([])
  const [barbers, setBarbers] = useState<any[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  
  // Selection state
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedBarber, setSelectedBarber] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  
  // Form state
  const [clientData, setClientData] = useState({ name: "", phone: "", email: "" })
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, barbersRes] = await Promise.all([
          fetch(`/api/services?shop=${shop.slug}`).then(res => res.json()).catch(() => ({ error: true })),
          fetch(`/api/barbers?shop=${shop.slug}`).then(res => res.json()).catch(() => ({ error: true }))
        ])
        setServices(Array.isArray(servicesRes) ? servicesRes : [])
        setBarbers(Array.isArray(barbersRes) ? barbersRes : [])
        
        if (!Array.isArray(servicesRes) || !Array.isArray(barbersRes)) {
          setError("No se pudieron cargar los servicios. Verifica la conexión a la base de datos.")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Error de conexión. Asegúrate de configurar el archivo .env.local")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [shop.slug])

  // Fetch availability when date, service or barber changes
  useEffect(() => {
    if (selectedService && selectedBarber && selectedDate) {
      async function fetchSlots() {
        setLoadingSlots(true)
        try {
          const formattedDate = format(selectedDate!, "yyyy-MM-dd")
          const res = await fetch(`/api/availability?shop=${shop.slug}&date=${formattedDate}&serviceId=${selectedService.id}&barberId=${selectedBarber.id}`)
          if (!res.ok) throw new Error("Error")
          const data = await res.json()
          setAvailableSlots(data.availableSlots || [])
          setSelectedTime("") // reset time when slots change
        } catch (err) {
          console.error("Error fetching slots", err)
        } finally {
          setLoadingSlots(false)
        }
      }
      fetchSlots()
    }
  }, [selectedService, selectedBarber, selectedDate])

  const handleNext = () => setStep(s => Math.min(s + 1, 4) as Step)
  const handlePrev = () => setStep(s => Math.max(s - 1, 1) as Step)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validations
    if (!clientData.name || !clientData.phone) {
      setError("Por favor completa los campos requeridos (*)")
      return
    }
    
    setError("")
    setIsSubmitting(true)
    
    try {
      const payload = {
        shopSlug: shop.slug,
        clientData,
        serviceId: selectedService.id,
        barberId: selectedBarber.id,
        date: selectedDate,
        startTime: selectedTime
      }
      
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error("Error al crear cita")
      
      handleNext() // Ir a pantalla de confirmación final
    } catch (err) {
      setError("Hubo un error al procesar tu cita. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <Card className="w-full bg-[#111111] border-[#22c55e]/20 text-white min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
    </Card>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[#0a0a0a] border-[#22c55e]/20 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22c55e]/0 via-[#22c55e] to-[#22c55e]/0" />
      
      <CardContent className="p-6 md:p-8">
        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-800 -z-10" />
          {[
            { num: 1, label: "Servicio", icon: Scissors },
            { num: 2, label: "Horario", icon: CalendarIcon },
            { num: 3, label: "Detalles", icon: User },
            { num: 4, label: "Confirmación", icon: CheckCircle },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-[#0a0a0a] px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step >= s.num ? "bg-[#22c55e] border-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-gray-900 border-gray-700 text-gray-500"
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs md:text-sm hidden sm:block ${step >= s.num ? "text-[#22c55e]" : "text-gray-500"}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Servicio y Barbero */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold mb-4">Elige tu Servicio</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(services) && services.length > 0 ? (
                      services.map(service => (
                        <motion.div 
                          key={service.id}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedService(service)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedService?.id === service.id ? 'border-[#22c55e] bg-[#22c55e]/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-gray-800 bg-[#111] hover:border-gray-600'}`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{service.name}</h3>
                            <span className="text-[#22c55e] font-bold text-lg">RD${service.price}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{service.description || `${service.duration} mins`}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 text-center text-gray-500 bg-[#111] rounded-lg border border-dashed border-gray-800">
                        No hay servicios disponibles actualmente.
                      </div>
                    )}
                  </div>
                </div>

                {selectedService && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <h2 className="text-xl font-bold mb-4 mt-8">Elige a tu Barbero</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Array.isArray(barbers) && barbers.length > 0 ? (
                        barbers.map(barber => (
                          <motion.div 
                            key={barber.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedBarber(barber)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors text-center ${selectedBarber?.id === barber.id ? 'border-[#22c55e] bg-[#22c55e]/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-gray-800 bg-[#111] hover:border-gray-600'}`}
                          >
                            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full mb-3 overflow-hidden border border-gray-700">
                              {barber.photoUrl ? (
                                <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-full h-full p-4 text-gray-400" />
                              )}
                            </div>
                            <h3 className="font-semibold">{barber.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{barber.specialty}</p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full py-8 text-center text-gray-500 bg-[#111] rounded-lg border border-dashed border-gray-800">
                          Cargando barberos disponibles...
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end pt-6">
                  <button 
                    disabled={!selectedService || !selectedBarber}
                    onClick={handleNext}
                    className="bg-[#22c55e] text-black px-6 py-2 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Fecha y Hora */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold mb-6">Selecciona Fecha y Hora</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#111] p-4 rounded-lg border border-gray-800 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date && date >= new Date(new Date().setHours(0,0,0,0))) {
                          setSelectedDate(date)
                        }
                      }}
                      locale={es}
                      className="rounded-md border-0 bg-transparent text-white"
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#22c55e]" />
                      Horarios Disponibles
                    </h3>
                    
                    {loadingSlots ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#22c55e] animate-spin" /></div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 bg-[#111] rounded-lg border border-gray-800">
                        No hay horarios disponibles este día.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map(time => (
                          <motion.button 
                            key={time}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 text-center text-sm rounded-md cursor-pointer transition-colors border ${selectedTime === time ? 'bg-[#22c55e] text-black border-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.4)] font-bold' : 'bg-[#111] border-gray-800 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5'}`}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={handlePrev} className="px-6 py-2 rounded-md font-semibold text-gray-400 hover:text-white transition-colors">Atrás</button>
                  <button 
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleNext}
                    className="bg-[#22c55e] text-black px-6 py-2 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Datos de Contacto */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="grid md:grid-cols-5 gap-8">
                  <div className="md:col-span-3">
                    <h2 className="text-xl font-bold mb-6">Tus Datos</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Nombre Completo *</label>
                        <Input 
                          value={clientData.name} 
                          onChange={e => setClientData({...clientData, name: e.target.value})}
                          placeholder="Ej. Juan Pérez"
                          className="bg-[#111] border-gray-800 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Teléfono *</label>
                        <Input 
                          value={clientData.phone} 
                          onChange={e => setClientData({...clientData, phone: e.target.value})}
                          placeholder="809-XXX-XXXX"
                          className="bg-[#111] border-gray-800 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Correo Electrónico (Opcional)</label>
                        <Input 
                          type="email"
                          value={clientData.email} 
                          onChange={e => setClientData({...clientData, email: e.target.value})}
                          placeholder="tu@email.com"
                          className="bg-[#111] border-gray-800 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] transition-all"
                        />
                      </div>
                    </form>
                  </div>
                  
                  {/* Resumen del pedido */}
                  <div className="md:col-span-2">
                    <div className="bg-[#111] p-6 rounded-lg border border-[#22c55e]/30 h-full">
                      <h3 className="font-bold text-lg mb-4 text-[#22c55e]">Resumen de Cita</h3>
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Servicio</span>
                          <span className="font-medium text-white">{selectedService?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Barbero</span>
                          <span className="font-medium text-white">{selectedBarber?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Fecha y Hora</span>
                          <span className="font-medium text-white capitalize">
                            {selectedDate && format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
                            {" - "}{selectedTime}
                          </span>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-lg">
                          <span className="text-gray-400">Total:</span>
                          <span className="font-bold text-[#22c55e]">RD${selectedService?.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={handlePrev} className="px-6 py-2 rounded-md font-semibold text-gray-400 hover:text-white transition-colors">Atrás</button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !clientData.name || !clientData.phone}
                    className="bg-[#22c55e] flex items-center gap-2 text-black px-6 py-2 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Confirmar Reserva
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Éxito */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/20 text-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">¡Cita Confirmada!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Gracias {clientData.name}. Tu cita para <strong>{selectedService?.name}</strong> con <strong>{selectedBarber?.name}</strong> ha sido agendada con éxito para el <strong>{selectedDate && format(selectedDate, "dd/MM/yyyy")} a las {selectedTime}</strong>.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-[#111] border border-gray-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
                >
                  Agendar Nueva Cita
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

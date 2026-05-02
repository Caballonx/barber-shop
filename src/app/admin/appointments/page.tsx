"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Check, X, Clock, Calendar as CalendarIcon, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const url = filter === "ALL" ? "/api/admin/appointments" : `/api/admin/appointments?status=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      setAppointments(data)
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [filter])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (res.ok) {
        setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt))
      }
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Gestión de Citas</h1>
          <p className="text-gray-400 mt-1">Administra todas las reservas de la barbería.</p>
        </div>
        
        <div className="flex gap-2 bg-[#111] p-1 rounded-lg border border-gray-800">
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f ? "bg-[#22c55e] text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "text-gray-400 hover:text-white"
              }`}
            >
              {f === "ALL" ? "Todas" : f}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-[#111111] border-[#22c55e]/20">
        <CardHeader>
          <CardTitle className="text-white">Listado de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-[#1a1a1a] border-b border-[#22c55e]/20">
                  <tr>
                    <th className="px-4 py-3">Fecha / Hora</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Barbero / Servicio</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {appointments.length > 0 ? appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#22c55e]/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3 text-[#22c55e]" />
                            {format(new Date(apt.date), "dd MMM, yyyy", { locale: es })}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {apt.startTime} - {apt.endTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{apt.client.name}</span>
                          <span className="text-xs text-gray-500">{apt.client.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-[#22c55e] font-medium">{apt.service.name}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {apt.barber.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full border ${
                          apt.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          apt.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          apt.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-gray-500/10 text-gray-500 border-gray-500/20'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {apt.status === "PENDING" && (
                            <button 
                              onClick={() => updateStatus(apt.id, "CONFIRMED")}
                              className="p-1.5 bg-green-500/10 text-green-500 rounded-md hover:bg-green-500 hover:text-black transition-all"
                              title="Confirmar"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                            <button 
                              onClick={() => updateStatus(apt.id, "CANCELLED")}
                              className="p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-black transition-all"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          {apt.status === "CONFIRMED" && (
                            <button 
                              onClick={() => updateStatus(apt.id, "COMPLETED")}
                              className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all"
                              title="Completar"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-20 text-center text-gray-500">
                        No se encontraron citas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

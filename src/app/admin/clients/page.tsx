"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, User, Mail, Phone, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/clients")
        const data = await res.json()
        setClients(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Clientes</h1>
          <p className="text-gray-400 mt-1">Directorio de clientes y su historial de visitas.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Buscar cliente..." 
            className="pl-10 bg-[#111] border-gray-800 focus:border-[#22c55e]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-[#111111] border-[#22c55e]/20">
        <CardHeader>
          <CardTitle className="text-white">Directorio ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#22c55e]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-[#0a0a0a] border-b border-[#22c55e]/20">
                  <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Contacto</th>
                    <th className="px-6 py-4">Visitas</th>
                    <th className="px-6 py-4">Última Visita</th>
                    <th className="px-6 py-4">Fecha Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-[#22c55e]/5 hover:bg-[#22c55e]/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 group-hover:border-[#22c55e]/30 group-hover:text-[#22c55e] transition-colors">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{client.name}</p>
                            <p className="text-xs text-gray-500">ID: {client.id.split('-')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3 h-3 text-[#22c55e]" /> {client.phone}
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="w-3 h-3 text-[#22c55e]" /> {client.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-900 text-[#22c55e] px-2.5 py-0.5 rounded-full border border-[#22c55e]/20 text-xs font-medium">
                          {client.totalAppointments}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {client.lastVisit ? (
                          <div className="flex items-center gap-2 text-xs">
                            <CalendarIcon className="w-3 h-3 text-gray-500" />
                            {format(new Date(client.lastVisit), "d 'de' MMM, yyyy", { locale: es })}
                          </div>
                        ) : (
                          <span className="text-gray-600 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {format(new Date(client.createdAt), "dd/MM/yyyy")}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No se encontraron clientes que coincidan con la búsqueda.
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

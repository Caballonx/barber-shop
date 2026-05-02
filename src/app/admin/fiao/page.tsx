"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Receipt, User, Scissors, DollarSign, Trash2, CheckCircle2, Clock, MessageSquare } from "lucide-react"

interface Debt {
  id: string
  clientName: string
  serviceName: string
  amount: number
  isPaid: boolean
  notes?: string
  createdAt: string
}

export default function FiaoPage() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    serviceName: "",
    amount: "",
    notes: ""
  })

  useEffect(() => {
    fetchDebts()
  }, [])

  async function fetchDebts() {
    try {
      const res = await fetch("/api/admin/fiao")
      const data = await res.json()
      setDebts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/fiao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setFormData({ clientName: "", serviceName: "", amount: "", notes: "" })
        fetchDebts()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const togglePaid = async (id: string, currentPaid: boolean) => {
    try {
      const res = await fetch("/api/admin/fiao", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPaid: !currentPaid })
      })
      if (res.ok) fetchDebts()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteDebt = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este registro?")) return
    try {
      const res = await fetch(`/api/admin/fiao?id=${id}`, { method: "DELETE" })
      if (res.ok) fetchDebts()
    } catch (err) {
      console.error(err)
    }
  }

  const totalPending = Array.isArray(debts) ? debts.reduce((acc, d) => !d.isPaid ? acc + d.amount : acc, 0) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Gestión de FIAO</h1>
          <p className="text-gray-400 mt-1">Control de créditos y servicios pendientes de cobro.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Pendiente</p>
          <p className="text-2xl font-black text-[#ef4444]">RD${totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulario de Registro */}
        <Card className="bg-[#111] border-[#22c55e]/20 text-white h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#22c55e]" />
              Registrar Nuevo
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Agrega manualmente un servicio fiado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    required
                    placeholder="Nombre del cliente"
                    value={formData.clientName}
                    onChange={e => setFormData({...formData, clientName: e.target.value})}
                    className="bg-black border-gray-800 pl-10 focus:border-[#22c55e]/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Servicio</label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    required
                    placeholder="Ej. Corte + Barba"
                    value={formData.serviceName}
                    onChange={e => setFormData({...formData, serviceName: e.target.value})}
                    className="bg-black border-gray-800 pl-10 focus:border-[#22c55e]/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Monto (RD$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    required
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="bg-black border-gray-800 pl-10 focus:border-[#22c55e]/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notas (Opcional)</label>
                <Input 
                  placeholder="Detalles adicionales..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="bg-black border-gray-800 focus:border-[#22c55e]/50"
                />
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#22c55e] text-black font-bold py-3 rounded-md hover:bg-green-500 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Registrar Deuda"}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Deudas */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-[#111] border-[#22c55e]/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Registros Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
                </div>
              ) : !Array.isArray(debts) || debts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>{!Array.isArray(debts) ? "Error al cargar datos." : "No hay deudas registradas."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800">
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">Servicio</th>
                        <th className="pb-3 text-right">Monto</th>
                        <th className="pb-3 text-center">Estado</th>
                        <th className="pb-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {debts.map((debt) => (
                        <tr key={debt.id} className="group hover:bg-white/[0.02]">
                          <td className="py-4">
                            <p className="font-bold">{debt.clientName}</p>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(debt.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="py-4 text-sm text-gray-300">{debt.serviceName}</td>
                          <td className="py-4 text-right font-mono font-bold">
                            RD${debt.amount.toLocaleString()}
                          </td>
                          <td className="py-4 text-center">
                            <button 
                              onClick={() => togglePaid(debt.id, debt.isPaid)}
                              className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                debt.isPaid 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {debt.isPaid ? 'Pagado' : 'Pendiente'}
                            </button>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => togglePaid(debt.id, debt.isPaid)}
                                className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                title={debt.isPaid ? "Marcar como pendiente" : "Marcar como pagado"}
                              >
                                <CheckCircle2 className={`w-4 h-4 ${debt.isPaid ? 'text-[#22c55e]' : ''}`} />
                              </button>
                              <button 
                                onClick={() => deleteDebt(debt.id)}
                                className="p-2 hover:bg-red-500/10 rounded-md transition-colors text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <a 
                                href={`https://wa.me/1${debt.notes?.match(/\d{10}/)?.[0] || ""}`} // Intenta extraer un tel de notas o simplemente link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-blue-500/10 rounded-md transition-colors text-gray-400 hover:text-blue-500"
                                title="Contactar cliente"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

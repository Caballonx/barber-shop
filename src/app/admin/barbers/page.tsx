"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Edit2, User, Save, X, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [isAdding, setIsAdding] = useState(false)

  const fetchBarbers = async () => {
    try {
      const res = await fetch("/api/admin/barbers")
      const data = await res.json()
      setBarbers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBarbers()
  }, [])

  const handleEdit = (barber: any) => {
    setEditingId(barber.id)
    setEditForm(barber)
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/barbers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        setBarbers(prev => prev.map(b => b.id === editForm.id ? editForm : b))
        setEditingId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const newBarber = {
      name: formData.get("name"),
      specialty: formData.get("specialty"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      workDays: ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB"], // Por defecto todos menos domingo
    }

    try {
      const res = await fetch("/api/admin/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBarber)
      })
      if (res.ok) {
        fetchBarbers()
        setIsAdding(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Barberos</h1>
          <p className="text-gray-400 mt-1">Administra el personal de la barbería.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#22c55e] text-black px-4 py-2 rounded-md font-semibold hover:bg-green-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Barbero
        </button>
      </div>

      {isAdding && (
        <Card className="bg-[#111] border-[#22c55e]/40 p-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="name" placeholder="Nombre completo" required className="bg-black border-gray-800" />
            <Input name="specialty" placeholder="Especialidad (Ej. Skin Fade)" required className="bg-black border-gray-800" />
            <Input name="startTime" type="text" placeholder="Entrada (09:00)" defaultValue="09:00" className="bg-black border-gray-800" />
            <Input name="endTime" type="text" placeholder="Salida (20:00)" defaultValue="20:00" className="bg-black border-gray-800" />
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white px-4">Cancelar</button>
              <button type="submit" className="bg-[#22c55e] text-black px-6 py-2 rounded-md font-bold">Crear Perfil</button>
            </div>
          </form>
        </Card>
      )}

      <Card className="bg-[#111111] border-[#22c55e]/20">
        <CardHeader>
          <CardTitle className="text-white">Equipo de Barberos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#22c55e]" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {barbers.map(barber => (
                <div key={barber.id} className="p-4 rounded-xl border border-gray-800 bg-black/40 group relative overflow-hidden transition-all hover:border-[#22c55e]/30">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 overflow-hidden">
                    {barber.photoUrl ? <img src={barber.photoUrl} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-700" />}
                  </div>

                  {editingId === barber.id ? (
                    <div className="space-y-2">
                      <Input 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="bg-black border-gray-700 h-8 text-center"
                      />
                      <Input 
                        value={editForm.specialty} 
                        onChange={e => setEditForm({...editForm, specialty: e.target.value})}
                        className="bg-black border-gray-700 h-8 text-center text-xs"
                      />
                      <div className="flex gap-1">
                        <Input 
                          value={editForm.startTime} 
                          onChange={e => setEditForm({...editForm, startTime: e.target.value})}
                          className="bg-black border-gray-700 h-8 text-center text-[10px]"
                        />
                        <Input 
                          value={editForm.endTime} 
                          onChange={e => setEditForm({...editForm, endTime: e.target.value})}
                          className="bg-black border-gray-700 h-8 text-center text-[10px]"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center pt-1">
                        {["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"].map(day => (
                          <button
                            key={day}
                            onClick={() => {
                              const current = editForm.workDays || []
                              const updated = current.includes(day) 
                                ? current.filter((d: string) => d !== day)
                                : [...current, day]
                              setEditForm({...editForm, workDays: updated})
                            }}
                            className={`text-[8px] px-1 rounded ${
                              editForm.workDays?.includes(day) ? "bg-[#22c55e] text-black" : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-center gap-2 pt-2">
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                        <button onClick={handleSave} className="p-1 text-[#22c55e] hover:text-green-400"><Save className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3 className="font-bold text-white mb-1">{barber.name}</h3>
                      <p className="text-xs text-[#22c55e] mb-3">{barber.specialty}</p>
                      <div className="text-[10px] text-gray-500 bg-gray-900/50 py-1 rounded">
                        {barber.startTime} - {barber.endTime}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(barber)} className="p-1 text-gray-500 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

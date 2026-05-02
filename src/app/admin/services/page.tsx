"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [isAdding, setIsAdding] = useState(false)

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services")
      const data = await res.json()
      setServices(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEdit = (service: any) => {
    setEditingId(service.id)
    setEditForm(service)
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === editForm.id ? editForm : s))
        setEditingId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const newService = {
      name: formData.get("name"),
      price: formData.get("price"),
      duration: formData.get("duration"),
      description: formData.get("description"),
      category: formData.get("category"),
    }

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService)
      })
      if (res.ok) {
        fetchServices()
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Servicios</h1>
          <p className="text-gray-400 mt-1">Configura los servicios ofrecidos y sus precios.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#22c55e] text-black px-4 py-2 rounded-md font-semibold hover:bg-green-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Servicio
        </button>
      </div>

      {isAdding && (
        <Card className="bg-[#111] border-[#22c55e]/40 p-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="name" placeholder="Nombre del servicio" required className="bg-black border-gray-800" />
            <Input name="price" type="number" placeholder="Precio (RD$)" required className="bg-black border-gray-800" />
            <Input name="duration" type="number" placeholder="Duración (minutos)" required className="bg-black border-gray-800" />
            <Input name="category" placeholder="Categoría" className="bg-black border-gray-800" />
            <div className="md:col-span-2">
              <Input name="description" placeholder="Descripción corta" className="bg-black border-gray-800" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white px-4">Cancelar</button>
              <button type="submit" className="bg-[#22c55e] text-black px-6 py-2 rounded-md font-bold">Crear</button>
            </div>
          </form>
        </Card>
      )}

      <Card className="bg-[#111111] border-[#22c55e]/20">
        <CardHeader>
          <CardTitle className="text-white">Catálogo de Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#22c55e]" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div key={service.id} className="p-4 rounded-lg border border-gray-800 bg-black/50 group relative">
                  {editingId === service.id ? (
                    <div className="space-y-2">
                      <Input 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="bg-black border-gray-700 h-8"
                      />
                      <div className="flex gap-2">
                        <Input 
                          value={editForm.price} 
                          type="number"
                          onChange={e => setEditForm({...editForm, price: e.target.value})}
                          className="bg-black border-gray-700 h-8"
                        />
                        <Input 
                          value={editForm.duration} 
                          type="number"
                          onChange={e => setEditForm({...editForm, duration: e.target.value})}
                          className="bg-black border-gray-700 h-8"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                        <button onClick={handleSave} className="p-1 text-[#22c55e] hover:text-green-400"><Save className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white">{service.name}</h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(service)} className="text-gray-500 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#22c55e] font-bold">RD${service.price}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">{service.duration} mins</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{service.description}</p>
                    </>
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

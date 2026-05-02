"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Save, Store, Clock, ShieldCheck, Bell } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings")
        const data = await res.json()
        setSettings(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        // Show success toast or similar
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ajustes</h1>
          <p className="text-gray-400 mt-1">Configuración general de la barbería y el sistema.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#22c55e] text-black px-6 py-2 rounded-md font-bold hover:bg-green-500 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Cambios
        </button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-[#111] border-[#22c55e]/20 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#22c55e]" />
              <CardTitle>Información del Local</CardTitle>
            </div>
            <CardDescription className="text-gray-500">Datos públicos que se muestran en la web.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Nombre de la Barbería</label>
                <Input 
                  value={settings.shopName}
                  onChange={e => setSettings({...settings, shopName: e.target.value})}
                  className="bg-black border-gray-800 focus:border-[#22c55e]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Correo de Contacto</label>
                <Input 
                  value={settings.contactEmail}
                  onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                  className="bg-black border-gray-800 focus:border-[#22c55e]/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Dirección Física</label>
              <Input 
                value={settings.address}
                onChange={e => setSettings({...settings, address: e.target.value})}
                className="bg-black border-gray-800 focus:border-[#22c55e]/50"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-[#22c55e]/20 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#22c55e]" />
              <CardTitle>Horarios de Atención</CardTitle>
            </div>
            <CardDescription className="text-gray-500">Define cuándo está abierta la barbería para recibir citas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Hora de Apertura</label>
                <Input 
                  value={settings.openingTime}
                  onChange={e => setSettings({...settings, openingTime: e.target.value})}
                  className="bg-black border-gray-800 focus:border-[#22c55e]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Hora de Cierre</label>
                <Input 
                  value={settings.closingTime}
                  onChange={e => setSettings({...settings, closingTime: e.target.value})}
                  className="bg-black border-gray-800 focus:border-[#22c55e]/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-[#22c55e]/20 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22c55e]" />
              <CardTitle>Seguridad y Reservas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/50 border border-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Confirmación Automática</p>
                <p className="text-xs text-gray-500">Las citas se confirman sin intervención manual.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.autoConfirm}
                onChange={e => setSettings({...settings, autoConfirm: e.target.checked})}
                className="w-5 h-5 accent-[#22c55e]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

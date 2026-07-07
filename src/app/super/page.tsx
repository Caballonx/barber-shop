"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Plus, Store, ExternalLink, KeyRound } from "lucide-react"

type Shop = {
  id: string
  slug: string
  name: string
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  subscriptionStatus: "TRIAL" | "ACTIVE" | "SUSPENDED"
  createdAt: string
  _count: { appointments: number; barbers: number; clients: number; users: number }
}

const STATUS_LABELS: Record<Shop["subscriptionStatus"], { label: string; className: string }> = {
  TRIAL: { label: "Prueba", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  ACTIVE: { label: "Activa", className: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30" },
  SUSPENDED: { label: "Suspendida", className: "bg-red-500/10 text-red-400 border-red-500/30" },
}

const inputClass =
  "w-full px-3 py-2 bg-[#1a1a1a] border border-[#22c55e]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-white placeholder-gray-500 text-sm"

export default function SuperDashboard() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [adminModalShop, setAdminModalShop] = useState<Shop | null>(null)

  const loadShops = useCallback(async () => {
    try {
      const res = await fetch("/api/super/shops")
      if (!res.ok) throw new Error()
      setShops(await res.json())
    } catch {
      setError("No se pudieron cargar las barberías")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadShops()
  }, [loadShops])

  const changeStatus = async (shop: Shop, subscriptionStatus: Shop["subscriptionStatus"]) => {
    const res = await fetch(`/api/super/shops/${shop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionStatus }),
    })
    if (res.ok) loadShops()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Store className="w-6 h-6 text-[#22c55e]" /> Barberías
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#22c55e] text-black px-4 py-2 rounded-md font-semibold hover:bg-green-500 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Nueva barbería
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">{error}</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-[#111111] text-gray-400 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Barbería</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-center">Citas</th>
              <th className="px-4 py-3 font-medium text-center">Barberos</th>
              <th className="px-4 py-3 font-medium text-center">Clientes</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {shops.map((shop) => {
              const status = STATUS_LABELS[shop.subscriptionStatus]
              return (
                <tr key={shop.id} className="hover:bg-[#111111]/50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{shop.name}</div>
                    <div className="text-gray-500 text-xs">{shop.contactEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/${shop.slug}`}
                      target="_blank"
                      className="text-[#22c55e] hover:underline flex items-center gap-1"
                    >
                      /{shop.slug} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={shop.subscriptionStatus}
                      onChange={(e) => changeStatus(shop, e.target.value as Shop["subscriptionStatus"])}
                      className={`px-2 py-1 rounded-md border text-xs font-semibold bg-transparent cursor-pointer ${status.className}`}
                    >
                      <option value="TRIAL" className="bg-[#111] text-white">Prueba</option>
                      <option value="ACTIVE" className="bg-[#111] text-white">Activa</option>
                      <option value="SUSPENDED" className="bg-[#111] text-white">Suspendida</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">{shop._count.appointments}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{shop._count.barbers}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{shop._count.clients}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setAdminModalShop(shop)}
                      className="flex items-center gap-1 text-xs text-gray-300 border border-gray-700 px-3 py-1.5 rounded-md hover:border-[#22c55e]/50 transition-colors"
                    >
                      <KeyRound className="w-3 h-3" /> Admins
                    </button>
                  </td>
                </tr>
              )
            })}
            {shops.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  Aún no hay barberías. Crea la primera.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateShopModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            loadShops()
          }}
        />
      )}
      {adminModalShop && (
        <AdminsModal shop={adminModalShop} onClose={() => setAdminModalShop(null)} />
      )}
    </div>
  )
}

function CreateShopModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    adminEmail: "",
    adminPassword: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const res = await fetch("/api/super/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug.trim().toLowerCase(),
          contactEmail: form.contactEmail || null,
          contactPhone: form.contactPhone || null,
          address: form.address || null,
          admin: form.adminEmail
            ? { email: form.adminEmail, password: form.adminPassword }
            : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Error al crear la barbería")
        return
      }
      onCreated()
    } catch {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Nueva barbería" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {error && (
          <div className="p-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">{error}</div>
        )}
        <Field label="Nombre *">
          <input required className={inputClass} value={form.name} onChange={set("name")} placeholder="FADE Barbershop" />
        </Field>
        <Field label="Slug (URL) *">
          <input required className={inputClass} value={form.slug} onChange={set("slug")} placeholder="fade" pattern="[a-z0-9\-]+" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email de contacto">
            <input type="email" className={inputClass} value={form.contactEmail} onChange={set("contactEmail")} />
          </Field>
          <Field label="Teléfono / WhatsApp">
            <input className={inputClass} value={form.contactPhone} onChange={set("contactPhone")} placeholder="+18095551234" />
          </Field>
        </div>
        <Field label="Dirección">
          <input className={inputClass} value={form.address} onChange={set("address")} />
        </Field>
        <div className="pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-3">Cuenta de administrador de la barbería (opcional, puedes crearla después)</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email admin">
              <input type="email" className={inputClass} value={form.adminEmail} onChange={set("adminEmail")} />
            </Field>
            <Field label="Contraseña admin">
              <input type="password" className={inputClass} value={form.adminPassword} onChange={set("adminPassword")} minLength={6} />
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancelar</button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#22c55e] text-black px-4 py-2 rounded-md font-semibold text-sm disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Crear barbería
          </button>
        </div>
      </form>
    </Modal>
  )
}

function AdminsModal({ shop, onClose }: { shop: { id: string; name: string }; onClose: () => void }) {
  const [admins, setAdmins] = useState<{ id: string; email: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ email: "", password: "", name: "" })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/super/shops/${shop.id}/admins`)
    if (res.ok) setAdmins(await res.json())
    setLoading(false)
  }, [shop.id])

  useEffect(() => {
    load()
  }, [load])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setSaving(true)
    try {
      const res = await fetch(`/api/super/shops/${shop.id}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Error")
        return
      }
      setMessage(`Admin listo: ${data.email}`)
      setForm({ email: "", password: "", name: "" })
      load()
    } catch {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`Admins de ${shop.name}`} onClose={onClose}>
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-[#22c55e] animate-spin" /></div>
      ) : (
        <>
          <ul className="space-y-2 mb-6">
            {admins.map((a) => (
              <li key={a.id} className="flex justify-between items-center bg-[#1a1a1a] px-3 py-2 rounded-md text-sm">
                <span className="text-white">{a.name}</span>
                <span className="text-gray-400">{a.email}</span>
              </li>
            ))}
            {admins.length === 0 && <li className="text-sm text-gray-500">Sin administradores todavía.</li>}
          </ul>
          <form onSubmit={submit} className="space-y-3 border-t border-gray-800 pt-4">
            <p className="text-xs text-gray-500">Crear admin o resetear contraseña (mismo email)</p>
            {error && <div className="p-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">{error}</div>}
            {message && <div className="p-2 text-sm text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-md">{message}</div>}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email *">
                <input type="email" required className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Contraseña *">
                <input type="password" required minLength={6} className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </Field>
            </div>
            <Field label="Nombre">
              <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cerrar</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#22c55e] text-black px-4 py-2 rounded-md font-semibold text-sm disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Guardar
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#111111] border border-[#22c55e]/20 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Users, Star, Loader2 } from "lucide-react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats")
        const stats = await res.json()
        setData(stats)
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
      </div>
    )
  }

  const { summary, weeklyRevenue, serviceData, todayAppointments } = data || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Resumen general de tu barbería hoy.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#111111] border-[#22c55e]/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Citas Hoy</CardTitle>
            <Calendar className="w-4 h-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.citasHoy || 0}</div>
            <p className="text-xs text-[#22c55e] mt-1">Sincronizado</p>
          </CardContent>
        </Card>
        <Card className="bg-[#111111] border-[#22c55e]/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Ingresos Hoy</CardTitle>
            <DollarSign className="w-4 h-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RD$ {summary?.ingresosHoy?.toLocaleString() || 0}</div>
            <p className="text-xs text-[#22c55e] mt-1">Hoy</p>
          </CardContent>
        </Card>
        <Card className="bg-[#111111] border-[#22c55e]/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Clientes Nuevos</CardTitle>
            <Users className="w-4 h-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary?.nuevosClientes || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Esta semana</p>
          </CardContent>
        </Card>
        <Card className="bg-[#111111] border-[#22c55e]/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Calificación</CardTitle>
            <Star className="w-4 h-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.rating?.toFixed(1) || 5.0}</div>
            <p className="text-xs text-gray-500 mt-1">Excelente servicio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#111111] border-[#22c55e]/20">
          <CardHeader>
            <CardTitle className="text-white">Ingresos de la Semana</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyRevenue}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} axisLine={false} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(value) => `RD$${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-[#111111] border-[#22c55e]/20">
          <CardHeader>
            <CardTitle className="text-white">Distribución de Servicios</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {serviceData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#111111] border-[#22c55e]/20">
        <CardHeader>
          <CardTitle className="text-white">Próximas citas de hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-[#1a1a1a] border-b border-[#22c55e]/20">
                <tr>
                  <th className="px-4 py-3">Hora</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Barbero</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments?.length > 0 ? todayAppointments.map((apt: any) => (
                  <tr key={apt.id} className="border-b border-[#22c55e]/10 hover:bg-[#22c55e]/5">
                    <td className="px-4 py-3 font-medium">{apt.startTime}</td>
                    <td className="px-4 py-3">
                      {apt.client.name} <br/>
                      <span className="text-xs text-gray-500">{apt.client.phone}</span>
                    </td>
                    <td className="px-4 py-3">
                      {apt.service.name} <br/>
                      <span className="text-[#22c55e]">RD${apt.price}</span>
                    </td>
                    <td className="px-4 py-3">{apt.barber.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full border ${
                        apt.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        apt.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No hay citas para hoy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

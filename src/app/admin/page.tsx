"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Users, Star, Loader2, ArrowUpRight, TrendingUp, Check, X, MessageSquare } from "lucide-react"
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
import { cn } from "@/lib/utils"

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const stats = await res.json()
      setData(stats)
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  useEffect(() => {
    fetchStats().then(() => setLoading(false))
    
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (res.ok) {
        fetchStats()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-[#22c55e]/20 rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 text-[#22c55e] animate-spin absolute inset-0" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Cargando métricas...</p>
      </div>
    )
  }

  const { summary, weeklyRevenue, serviceData, todayAppointments } = data || {}

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Bienvenido, <span className="text-[#22c55e]">Admin</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Aquí tienes el resumen de tu barbería para hoy.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="px-4 py-2 bg-[#22c55e]/10 rounded-xl border border-[#22c55e]/20">
            <span className="text-[#22c55e] text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              En vivo
            </span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Citas Hoy", value: summary?.citasHoy || 0, icon: Calendar, color: "#22c55e", label: "Programadas" },
          { title: "Ingresos Hoy", value: `RD$ ${summary?.ingresosHoy?.toLocaleString() || 0}`, icon: DollarSign, color: "#3b82f6", label: "Generados" },
          { title: "Clientes Nuevos", value: `+${summary?.nuevosClientes || 0}`, icon: Users, color: "#f59e0b", label: "Esta semana" },
          { title: "Calificación", value: summary?.rating?.toFixed(1) || 5.0, icon: Star, color: "#ec4899", label: "Promedio" },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="bg-[#0f0f0f] border-white/5 hover:border-[#22c55e]/30 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-16 h-16" style={{ color: stat.color }} />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold text-gray-400">{stat.title}</CardTitle>
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: stat.color }} />
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="h-full bg-[#0f0f0f] border-white/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">Ingresos de la Semana</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Comparativa de ingresos diarios</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent className="h-[350px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyRevenue}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#444" 
                    tick={{ fill: '#666', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#444" 
                    tick={{ fill: '#666', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                    labelStyle={{ color: '#888', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="#22c55e" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorIngresos)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="h-full bg-[#0f0f0f] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-xl">Distribución de Servicios</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Servicios más demandados</p>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {serviceData?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    formatter={(value) => <span className="text-gray-400 text-sm font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Appointments Table */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#0f0f0f] border-white/5 overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">Próximas Citas</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Listado detallado para el día de hoy</p>
              </div>
              <button className="text-sm font-bold text-[#22c55e] hover:underline transition-all">
                Ver todas
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-500 uppercase tracking-[0.2em] bg-white/5">
                  <tr>
                    <th className="px-6 py-4 font-bold">Hora</th>
                    <th className="px-6 py-4 font-bold">Cliente</th>
                    <th className="px-6 py-4 font-bold">Servicio</th>
                    <th className="px-6 py-4 font-bold">Barbero</th>
                    <th className="px-6 py-4 font-bold text-center">Estado</th>
                    <th className="px-6 py-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {todayAppointments?.length > 0 ? todayAppointments.map((apt: any) => (
                    <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5 font-bold text-white tabular-nums">{apt.startTime}</td>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white">{apt.client.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{apt.client.phone}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-gray-300 font-medium">{apt.service.name}</div>
                        <div className="text-[#22c55e] font-bold mt-0.5">RD$ {apt.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                            {apt.barber.name.charAt(0)}
                          </div>
                          <span className="text-gray-300">{apt.barber.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <span className={cn(
                            "px-3 py-1 text-[10px] font-bold rounded-full border tracking-wider uppercase",
                            apt.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            apt.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                            apt.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          )}>
                            {apt.status === 'COMPLETED' ? 'Completada' : 
                             apt.status === 'CONFIRMED' ? 'Confirmada' : 
                             apt.status === 'PENDING' ? 'Pendiente' : 'Cancelada'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}
                                className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all"
                                title="Marcar como completada"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black transition-all"
                                title="Cancelar cita"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <a 
                            href={`https://wa.me/${apt.client.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                            title="Enviar WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Calendar className="w-10 h-10 text-gray-700" />
                          <p className="text-gray-500 font-medium text-lg">No hay citas programadas para hoy.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

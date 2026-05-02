"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, DollarSign, TrendingUp, CreditCard, PieChart as PieIcon } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']

export default function RevenuePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const res = await fetch("/api/admin/revenue")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
      </div>
    )
  }

  const { dailyRevenue, categoryRevenue, totalRevenue, completedCount, averageTicket } = data || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Ingresos</h1>
        <p className="text-gray-400 mt-1">Análisis detallado de facturación y rendimiento financiero.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#111] border-[#22c55e]/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Mes Actual</CardTitle>
            <DollarSign className="w-4 h-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RD$ {totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-[#22c55e] mt-1">+{completedCount} servicios completados</p>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-[#22c55e]/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Ticket Promedio</CardTitle>
            <TrendingUp className="w-4 h-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RD$ {averageTicket?.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Promedio por cliente</p>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-[#22c55e]/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Método de Pago</CardTitle>
            <CreditCard className="w-4 h-4 text-[#22c55e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Efectivo / Tarjeta</div>
            <p className="text-xs text-gray-500 mt-1">Basado en registros</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#111] border-[#22c55e]/20">
          <CardHeader>
            <CardTitle className="text-white">Ingresos Diarios (Este Mes)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `RD$${val}`} />
                <Tooltip 
                  cursor={{fill: 'rgba(34, 197, 94, 0.05)'}}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}
                />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-[#111] border-[#22c55e]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#22c55e]" /> Por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryRevenue?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

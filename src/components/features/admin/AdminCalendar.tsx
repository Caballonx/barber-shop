"use client"

import React, { useState, ReactNode } from "react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Scissors } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminCalendarProps {
  appointments: any[]
}

export function AdminCalendar({ appointments }: AdminCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f0f0f]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#22c55e]/10 rounded-lg text-[#22c55e]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    return (
      <div className="grid grid-cols-7 border-b border-white/5 bg-[#0a0a0a]">
        {days.map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    })

    const rows: ReactNode[] = []
    let days: ReactNode[] = []

    calendarDays.forEach((day, i) => {
      const dayAppointments = appointments.filter(apt => 
        isSameDay(new Date(apt.date), day)
      )

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "min-h-[120px] p-2 border-r border-b border-white/5 transition-all relative group",
            !isSameMonth(day, monthStart) ? "bg-[#050505]/50 opacity-20" : "bg-[#0a0a0a]",
            isSameDay(day, new Date()) && "bg-[#22c55e]/[0.02]"
          )}
          onClick={() => setSelectedDate(day)}
        >
          <span className={cn(
            "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full mb-2",
            isSameDay(day, new Date()) 
              ? "bg-[#22c55e] text-black" 
              : isSameDay(day, selectedDate)
                ? "bg-white text-black"
                : "text-gray-500"
          )}>
            {format(day, "d")}
          </span>

          <div className="space-y-1">
            {dayAppointments.slice(0, 3).map((apt) => (
              <div 
                key={apt.id}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-bold truncate border",
                  apt.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  apt.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20'
                )}
              >
                {apt.startTime} {apt.client.name.split(' ')[0]}
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <div className="text-[8px] text-gray-600 font-bold pl-1">
                + {dayAppointments.length - 3} más
              </div>
            )}
          </div>

          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-[#22c55e]/[0.03] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
        </div>
      )

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div className="grid grid-cols-7" key={day.toString()}>
            {days}
          </div>
        )
        days = []
      }
    })

    return <div className="bg-[#0a0a0a]">{rows}</div>
  }

  const selectedDayAppointments = appointments.filter(apt => 
    isSameDay(new Date(apt.date), selectedDate)
  ).sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 rounded-2xl border border-white/5 overflow-hidden shadow-2xl bg-[#0f0f0f]">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <div className="w-full lg:w-80 space-y-4">
        <div className="p-6 rounded-2xl border border-white/5 bg-[#0f0f0f]">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#22c55e]" />
            {format(selectedDate, "dd 'de' MMMM", { locale: es })}
          </h3>
          
          <div className="space-y-3">
            {selectedDayAppointments.length > 0 ? selectedDayAppointments.map((apt) => (
              <div 
                key={apt.id} 
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#22c55e]/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black text-[#22c55e] tabular-nums">
                    {apt.startTime}
                  </span>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-1.5 py-0.5 rounded border",
                    apt.status === 'COMPLETED' ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' :
                    apt.status === 'CANCELLED' ? 'text-red-500 border-red-500/20 bg-red-500/10' :
                    'text-[#22c55e] border-[#22c55e]/20 bg-[#22c55e]/10'
                  )}>
                    {apt.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-bold text-white truncate">{apt.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-400 truncate">{apt.service.name}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm italic">Sin citas para este día</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { AppointmentStatus } from "@/generated/prisma"

export interface Appointment {
  id: string
  clientId: string
  barberId: string
  serviceId: string
  date: Date | string
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes: string | null
  price: number
  paymentMethod: string | null
  createdAt: Date | string
  client: {
    id: string
    name: string
    phone: string
    email: string | null
  }
  barber: {
    id: string
    name: string
    specialty: string
  }
  service: {
    id: string
    name: string
    price: number
    duration: number
  }
}

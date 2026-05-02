import * as z from "zod"

export const serviceSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  price: z.number().min(0, "El precio debe ser un valor positivo"),
  duration: z.number().min(5, "La duración mínima es de 5 minutos"),
  category: z.string().min(2, "La categoría es requerida"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})

export const barberSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  specialty: z.string().min(2, "La especialidad es requerida"),
  bio: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  workDays: z.array(z.string()).min(1, "Debe seleccionar al menos un día"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
})

export const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "Debe ser un número válido").regex(/^[0-9\-\+\s]+$/, "Formato inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
})

export const appointmentSchema = z.object({
  clientId: z.string().optional(), // Puede ser creado al momento
  client: clientSchema.optional(), // Datos del cliente si es nuevo
  barberId: z.string().min(1, "Debe seleccionar un barbero"),
  serviceId: z.string().min(1, "Debe seleccionar un servicio"),
  date: z.date({ message: "Debe seleccionar una fecha" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido"),
  notes: z.string().optional(),
  price: z.number(),
  paymentMethod: z.string().optional(),
})

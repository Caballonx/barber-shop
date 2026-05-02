import { NextResponse } from "next/server"

// Mock settings storage (in a real app this would be in a DB table 'Settings')
let settings = {
  shopName: "FADE Barbershop",
  address: "Winston Churchill 1206, Piantini",
  phone: "+1 (809) 555-3274",
  email: "contacto@fadebarbershop.com",
  openingHour: "09:00",
  closingHour: "20:00",
  allowAutomaticConfirmation: true
}

export async function GET() {
  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const body = await request.json()
  settings = { ...settings, ...body }
  return NextResponse.json(settings)
}

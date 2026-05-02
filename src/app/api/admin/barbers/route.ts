import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const barbers = await prisma.barber.findMany()
    return NextResponse.json(barbers)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const barber = await prisma.barber.create({
      data: {
        name: body.name,
        specialty: body.specialty,
        bio: body.bio,
        photoUrl: body.photoUrl,
        startTime: body.startTime || "09:00",
        endTime: body.endTime || "20:00",
        workDays: body.workDays || ["LUN","MAR","MIE","JUE","VIE","SAB"],
        isActive: true
      }
    })
    return NextResponse.json(barber)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const barber = await prisma.barber.update({
      where: { id },
      data
    })
    return NextResponse.json(barber)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

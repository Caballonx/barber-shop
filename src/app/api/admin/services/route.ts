import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" }
    })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseInt(body.price),
        duration: parseInt(body.duration),
        category: body.category || "General",
        isActive: true
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? parseInt(data.price) : undefined,
        duration: data.duration ? parseInt(data.duration) : undefined,
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

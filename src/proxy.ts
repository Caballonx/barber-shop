import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to the login page without a token
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Check for a valid NextAuth JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // /super/* is only for the SaaS owner
  if (pathname.startsWith("/super") && token.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Shop admins land on their panel; super admins on theirs
  if (pathname.startsWith("/admin") && token.role === "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/super", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/super/:path*"],
}

import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl
      // Permitir acceso a la página de login sin token
      if (pathname === "/admin/login") return true
      // Requerir token para cualquier otra ruta de admin
      return !!token
    },
  },
  pages: {
    signIn: "/admin/login",
  },
})

export const config = {
  matcher: ["/admin/:path*"],
}

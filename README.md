# FADE Barbershop - Admin & Landing

Sistema integral para FADE Barbershop con Landing Page premium y Panel Administrativo.

## 🚀 Tecnologías
- **Core**: Next.js 15 (App Router)
- **Base de Datos**: Supabase (PostgreSQL) + Prisma ORM
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS 4 + Shadcn UI
- **Despliegue**: Vercel

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio**
2.  **Instalar dependencias**: `npm install`
3.  **Configurar Variables de Entorno**: Crea un archivo `.env.local` con:
    ```env
    DATABASE_URL="tu_url_de_supabase_con_pgbouncer"
    DIRECT_URL="tu_url_de_supabase_directa"
    NEXTAUTH_SECRET="tu_secreto"
    NEXTAUTH_URL="http://localhost:3000"
    ```
4.  **Generar Cliente Prisma**: `npx prisma generate`
5.  **Iniciar Servidor**: `npm run dev`

## 🔐 Credenciales del Panel
- **URL**: `/admin`
- **Usuario**: `admin@fade.com`
- **Password**: `admin123`

## 📦 Despliegue en Vercel
1.  Conecta tu repositorio de GitHub a Vercel.
2.  Agrega las variables de entorno (`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`).
3.  Establece `NEXTAUTH_URL` con el dominio de Vercel.
4.  ¡Listo!

---
Desarrollado con ❤️ para FADE Barbershop.

import { cache } from "react"
import { prisma } from "@/lib/db/prisma"

/** Busca una tienda por su slug público. Cacheado por request. */
export const getShopBySlug = cache(async (slug: string) => {
  if (!slug) return null
  return prisma.shop.findUnique({ where: { slug } })
})

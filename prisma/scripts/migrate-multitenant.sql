-- Migración single-tenant -> multi-tenant.
-- Ejecutar UNA VEZ contra la BD existente:
--   npx prisma db execute --file prisma/scripts/migrate-multitenant.sql
-- Después: npx prisma db push  (sincroniza cualquier resto) y crear el SUPER_ADMIN con:
--   npx tsx prisma/scripts/create-super-admin.ts

BEGIN;

-- 1. Enums
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'SUSPENDED');
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'SHOP_ADMIN');

-- 2. Tabla Shop
CREATE TABLE "Shop" (
  "id"                 TEXT NOT NULL,
  "slug"               TEXT NOT NULL,
  "name"               TEXT NOT NULL,
  "contactEmail"       TEXT,
  "contactPhone"       TEXT,
  "address"            TEXT,
  "openingTime"        TEXT NOT NULL DEFAULT '09:00',
  "closingTime"        TEXT NOT NULL DEFAULT '20:00',
  "autoConfirm"        BOOLEAN NOT NULL DEFAULT true,
  "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Shop_slug_key" ON "Shop"("slug");

-- 3. Shop inicial "fade" a partir de ShopConfig (si existe; si no, con defaults)
INSERT INTO "Shop" ("id", "slug", "name", "contactEmail", "address", "openingTime", "closingTime", "autoConfirm", "subscriptionStatus")
SELECT
  'shop_fade',
  'fade',
  COALESCE(sc."shopName", 'FADE Barbershop'),
  COALESCE(sc."contactEmail", 'contacto@fadebarbershop.com'),
  COALESCE(sc."address", 'Winston Churchill 1206, Piantini'),
  COALESCE(sc."openingTime", '09:00'),
  COALESCE(sc."closingTime", '20:00'),
  COALESCE(sc."autoConfirm", true),
  'ACTIVE'
FROM (SELECT 1) AS one
LEFT JOIN "ShopConfig" sc ON sc."id" = 'default';

-- 4. Columnas shopId + backfill + NOT NULL + FK + índice
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['Service','Barber','Client','Appointment','BlockedSlot','Revenue','Debt','push_subscriptions']
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN "shopId" TEXT', t);
    EXECUTE format('UPDATE %I SET "shopId" = ''shop_fade''', t);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN "shopId" SET NOT NULL', t);
    EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE', t, t || '_shopId_fkey');
    EXECUTE format('CREATE INDEX %I ON %I ("shopId")', t || '_shopId_idx', t);
  END LOOP;
END $$;

-- 5. Clientes: deduplicar por (shopId, phone) sería innecesario aquí (un solo shop),
--    pero puede haber duplicados históricos por phone. Los dejamos: la unique se crea
--    solo si no hay duplicados; si falla, limpiar manualmente.
CREATE UNIQUE INDEX "Client_shopId_phone_key" ON "Client"("shopId", "phone");

-- 6. User: shopId opcional + role enum
ALTER TABLE "User" ADD COLUMN "shopId" TEXT;
UPDATE "User" SET "shopId" = 'shop_fade';
ALTER TABLE "User" ADD CONSTRAINT "User_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "User_shopId_idx" ON "User"("shopId");
UPDATE "User" SET "role" = 'SHOP_ADMIN' WHERE "role" NOT IN ('SUPER_ADMIN', 'SHOP_ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'SHOP_ADMIN';

-- 7. Fuera ShopConfig
DROP TABLE IF EXISTS "ShopConfig";

COMMIT;

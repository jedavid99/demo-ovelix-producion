-- AlterTable: slug público de la empresa (armado de URLs /presupuesto.<slug>)
ALTER TABLE "Company" ADD COLUMN "slug" TEXT;

-- Backfill: los existentes heredan su codigo_empresa normalizado
UPDATE "Company" SET "slug" = LOWER("codigo_empresa") WHERE "slug" IS NULL;

-- Not null + único
ALTER TABLE "Company" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "Company" ADD CONSTRAINT "Company_slug_key" UNIQUE ("slug");

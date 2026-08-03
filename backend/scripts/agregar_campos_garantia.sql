-- Script SQL para agregar campos de garantía a la tabla Repair
-- Ejecutar en Supabase/PostgreSQL

-- Agregar campos de garantía a la tabla Repair
ALTER TABLE "Repair"
ADD COLUMN IF NOT EXISTS "tiene_garantia" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "garantia_duracion" INTEGER,
ADD COLUMN IF NOT EXISTS "garantia_unidad" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "fecha_inicio_garantia" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "fecha_fin_garantia" TIMESTAMP(3);

-- Agregar índices para optimizar búsquedas por garantía
CREATE INDEX IF NOT EXISTS "Repair_tiene_garantia_idx" ON "Repair"("tiene_garantia");
CREATE INDEX IF NOT EXISTS "Repair_fecha_fin_garantia_idx" ON "Repair"("fecha_fin_garantia");

-- Comentarios sobre los campos
COMMENT ON COLUMN "Repair"."tiene_garantia" IS 'Indica si la reparación tiene garantía activa';
COMMENT ON COLUMN "Repair"."garantia_duracion" IS 'Duración de la garantía en días o meses';
COMMENT ON COLUMN "Repair"."garantia_unidad" IS 'Unidad de tiempo de la garantía: DIAS o MESES';
COMMENT ON COLUMN "Repair"."fecha_inicio_garantia" IS 'Fecha desde la cual corre la garantía (generalmente fecha de entrega)';
COMMENT ON COLUMN "Repair"."fecha_fin_garantia" IS 'Fecha de vencimiento de la garantía (calculada automáticamente)';

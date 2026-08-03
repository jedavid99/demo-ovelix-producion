-- MIGRACIÓN DE ESTADOS DE REPARACIÓN (INGLÉS → ESPAÑOL)
-- Ejecutar este script en PostgreSQL para migrar los datos existentes

-- 1. Crear el nuevo tipo ENUM
CREATE TYPE "EstadoReparacion" AS ENUM (
  'INGRESADO',
  'EN_COLA_DIAGNOSTICO',
  'EN_DIAGNOSTICO',
  'PRESUPUESTADO_ESPERANDO_OK',
  'PRESUPUESTO_RECHAZADO',
  'RESPALDO_DE_DATOS',
  'EN_REPARACION',
  'ESPERANDO_REPUESTO_LOCAL',
  'ESPERANDO_REPUESTO_IMPORTACION',
  'EN_PRUEBAS_CONTROL_CALIDAD',
  'REPARADO_PENDIENTE_PAGO',
  'LISTO_PARA_RETIRAR',
  'ENTREGADO_AL_CLIENTE',
  'CERRADO_FACTURADO',
  'IRREPARABLE_PARA_RETIRAR',
  'IRREPARABLE_ENTREGADO',
  'EN_GARANTIA_REINGRESO',
  'GARANTIA_ENTREGADO',
  'ABANDONADO_POR_CLIENTE',
  'CANCELADO_POR_CLIENTE'
);

-- 2. Agregar columna temporal con el nuevo tipo
ALTER TABLE "Repair" ADD COLUMN "estado_nuevo" "EstadoReparacion";

-- 3. Mapear valores antiguos a nuevos
UPDATE "Repair" SET "estado_nuevo" = 'INGRESADO' WHERE "estado" = 'PENDING';
UPDATE "Repair" SET "estado_nuevo" = 'EN_DIAGNOSTICO' WHERE "estado" = 'DIAGNOSTIC';
UPDATE "Repair" SET "estado_nuevo" = 'EN_REPARACION' WHERE "estado" = 'IN_PROGRESS';
UPDATE "Repair" SET "estado_nuevo" = 'ESPERANDO_REPUESTO_LOCAL' WHERE "estado" = 'WAITING_PARTS';
UPDATE "Repair" SET "estado_nuevo" = 'LISTO_PARA_RETIRAR' WHERE "estado" = 'READY';
UPDATE "Repair" SET "estado_nuevo" = 'ENTREGADO_AL_CLIENTE' WHERE "estado" = 'DELIVERED';
UPDATE "Repair" SET "estado_nuevo" = 'ENTREGADO_AL_CLIENTE' WHERE "estado" = 'ENTREGADO';
UPDATE "Repair" SET "estado_nuevo" = 'CANCELADO_POR_CLIENTE' WHERE "estado" = 'CANCELLED';
UPDATE "Repair" SET "estado_nuevo" = 'PRESUPUESTO_RECHAZADO' WHERE "estado" = 'BUDGET_REJECTED';
UPDATE "Repair" SET "estado_nuevo" = 'IRREPARABLE_PARA_RETIRAR' WHERE "estado" = 'IRREPARABLE';

-- 4. Eliminar la columna antigua y renombrar la nueva
ALTER TABLE "Repair" DROP COLUMN "estado";
ALTER TABLE "Repair" RENAME COLUMN "estado_nuevo" TO "estado";

-- 5. Establecer el valor por defecto
ALTER TABLE "Repair" ALTER COLUMN "estado" SET DEFAULT 'INGRESADO';

-- 6. (Opcional) Eliminar el tipo ENUM antiguo
-- DROP TYPE "RepairStatus";

-- 7. Verificar la migración
SELECT "estado", COUNT(*) FROM "Repair" GROUP BY "estado";

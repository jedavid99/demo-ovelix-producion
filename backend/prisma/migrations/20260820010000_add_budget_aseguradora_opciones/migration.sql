-- AlterTable
ALTER TABLE "StandaloneBudget" ADD COLUMN "es_aseguradora" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "StandaloneBudget" ADD COLUMN "aseguradora_nombre" TEXT;
ALTER TABLE "StandaloneBudget" ADD COLUMN "suma_total" BOOLEAN NOT NULL DEFAULT true;
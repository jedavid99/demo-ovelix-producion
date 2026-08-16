-- AlterTable
ALTER TABLE "RepairCost" ADD COLUMN "tipo_equipo" TEXT;

-- CreateIndex
CREATE INDEX "RepairCost_tipo_equipo_idx" ON "RepairCost"("tipo_equipo");

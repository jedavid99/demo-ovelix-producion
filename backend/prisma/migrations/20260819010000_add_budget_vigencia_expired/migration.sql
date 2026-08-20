-- AlterEnum
ALTER TYPE "StandaloneBudgetStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "StandaloneBudget" ADD COLUMN     "fecha_vencimiento" TIMESTAMP(3),
ADD COLUMN     "repair_id" TEXT,
ADD COLUMN     "vigencia_dias" INTEGER NOT NULL DEFAULT 7;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidad_id" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_cliente_id_idx" ON "Review"("cliente_id");

-- CreateIndex
CREATE INDEX "Review_entidad_entidad_id_idx" ON "Review"("entidad", "entidad_id");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneBudget_repair_id_key" ON "StandaloneBudget"("repair_id");

-- CreateIndex
CREATE INDEX "StandaloneBudget_fecha_vencimiento_idx" ON "StandaloneBudget"("fecha_vencimiento");

-- AddForeignKey
ALTER TABLE "StandaloneBudget" ADD CONSTRAINT "StandaloneBudget_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "Repair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
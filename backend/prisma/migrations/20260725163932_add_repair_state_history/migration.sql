/*
  Warnings:

  - The `estado` column on the `Repair` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoReparacion" AS ENUM ('INGRESADO', 'EN_COLA_DIAGNOSTICO', 'EN_DIAGNOSTICO', 'PRESUPUESTADO_ESPERANDO_OK', 'PRESUPUESTO_RECHAZADO', 'RESPALDO_DE_DATOS', 'EN_REPARACION', 'ESPERANDO_REPUESTO_LOCAL', 'ESPERANDO_REPUESTO_IMPORTACION', 'EN_PRUEBAS_CONTROL_CALIDAD', 'REPARADO_PENDIENTE_PAGO', 'LISTO_PARA_RETIRAR', 'ENTREGADO_AL_CLIENTE', 'CERRADO_FACTURADO', 'IRREPARABLE_PARA_RETIRAR', 'IRREPARABLE_ENTREGADO', 'EN_GARANTIA_REINGRESO', 'GARANTIA_ENTREGADO', 'ABANDONADO_POR_CLIENTE', 'CANCELADO_POR_CLIENTE');

-- AlterTable
ALTER TABLE "Repair" ADD COLUMN     "fecha_fin_garantia" TIMESTAMP(3),
ADD COLUMN     "fecha_inicio_garantia" TIMESTAMP(3),
ADD COLUMN     "garantia_duracion" INTEGER,
ADD COLUMN     "garantia_unidad" TEXT,
ADD COLUMN     "tiene_garantia" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoReparacion" NOT NULL DEFAULT 'INGRESADO';

-- DropEnum
DROP TYPE "RepairStatus";

-- CreateTable
CREATE TABLE "repair_state_history" (
    "id" TEXT NOT NULL,
    "repair_id" TEXT NOT NULL,
    "estado" "EstadoReparacion" NOT NULL,
    "usuario_id" TEXT,
    "nota" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repair_state_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "repair_state_history_repair_id_created_at_idx" ON "repair_state_history"("repair_id", "created_at");

-- CreateIndex
CREATE INDEX "Brand_empresa_id_idx" ON "Brand"("empresa_id");

-- CreateIndex
CREATE INDEX "Brand_nombre_idx" ON "Brand"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_nombre_empresa_id_key" ON "Brand"("nombre", "empresa_id");

-- CreateIndex
CREATE INDEX "Repair_estado_idx" ON "Repair"("estado");

-- AddForeignKey
ALTER TABLE "repair_state_history" ADD CONSTRAINT "repair_state_history_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "Repair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_state_history" ADD CONSTRAINT "repair_state_history_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

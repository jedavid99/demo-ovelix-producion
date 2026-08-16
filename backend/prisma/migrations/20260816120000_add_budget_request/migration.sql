-- CreateEnum
CREATE TYPE "BudgetRequestEstado" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'CONVERTIDO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "BudgetRequest" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "estado" "BudgetRequestEstado" NOT NULL DEFAULT 'PENDIENTE',
    "nombre" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "categoria" TEXT,
    "dispositivo" TEXT NOT NULL,
    "modelo" TEXT,
    "problema" TEXT,
    "descripcion" TEXT,
    "tiempo_estimado" TEXT,
    "precio_ofertado" DECIMAL(10,2),
    "precio_ajustado" DECIMAL(10,2),
    "plan_pago" TEXT,
    "sena_monto" DECIMAL(10,2),
    "sena_metodo" TEXT,
    "comprobante" TEXT,
    "resto_metodo" TEXT,
    "delivery_metodo" TEXT,
    "delivery_direccion" TEXT,
    "delivery_costo" DECIMAL(10,2),
    "turno_fecha" TEXT,
    "turno_horario" TEXT,
    "notas_admin" TEXT,
    "repair_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BudgetRequest_numero_key" ON "BudgetRequest"("numero");

-- CreateIndex
CREATE INDEX "BudgetRequest_empresa_id_idx" ON "BudgetRequest"("empresa_id");

-- CreateIndex
CREATE INDEX "BudgetRequest_estado_idx" ON "BudgetRequest"("estado");

-- CreateIndex
CREATE INDEX "BudgetRequest_created_at_idx" ON "BudgetRequest"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetRequest_repair_id_key" ON "BudgetRequest"("repair_id");

-- AddForeignKey
ALTER TABLE "BudgetRequest" ADD CONSTRAINT "BudgetRequest_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "Repair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetRequest" ADD CONSTRAINT "BudgetRequest_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- CreateEnum
CREATE TYPE "StandaloneBudgetStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "StandaloneBudget" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "cliente_nombre" TEXT NOT NULL,
    "cliente_dni" TEXT,
    "cliente_telefono" TEXT NOT NULL,
    "dispositivo" TEXT NOT NULL,
    "tipo_dispositivo" TEXT,
    "problema" TEXT,
    "tecnico" TEXT NOT NULL,
    "tipo" TEXT,
    "categoria" TEXT,
    "tax_rate_id" TEXT,
    "tax_rate_name" TEXT,
    "tax_rate_porct" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "base_total" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" "StandaloneBudgetStatus" NOT NULL DEFAULT 'PENDING',
    "items" JSONB NOT NULL,
    "notas" TEXT,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_respuesta" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandaloneBudget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneBudget_numero_key" ON "StandaloneBudget"("numero");

-- CreateIndex
CREATE INDEX "StandaloneBudget_empresa_id_idx" ON "StandaloneBudget"("empresa_id");

-- CreateIndex
CREATE INDEX "StandaloneBudget_estado_idx" ON "StandaloneBudget"("estado");

-- AddForeignKey
ALTER TABLE "StandaloneBudget" ADD CONSTRAINT "StandaloneBudget_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
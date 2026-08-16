-- CreateTable
CREATE TABLE "RepairCost" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "tiempo_estimado" TEXT NOT NULL,
    "descripcion" TEXT,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RepairCost_empresa_id_idx" ON "RepairCost"("empresa_id");
CREATE INDEX "RepairCost_categoria_idx" ON "RepairCost"("categoria");
CREATE INDEX "RepairCost_activo_idx" ON "RepairCost"("activo");

-- AddForeignKey
ALTER TABLE "RepairCost" ADD CONSTRAINT "RepairCost_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
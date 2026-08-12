-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "proveedor" TEXT,
    "monto" DECIMAL(12,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "metodo_pago" TEXT NOT NULL DEFAULT 'efectivo',
    "estado" TEXT NOT NULL DEFAULT 'completada',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresa_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_empresa_id_idx" ON "Expense"("empresa_id");
CREATE INDEX "Expense_categoria_idx" ON "Expense"("categoria");
CREATE INDEX "Expense_estado_idx" ON "Expense"("estado");
CREATE INDEX "Expense_fecha_idx" ON "Expense"("fecha");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

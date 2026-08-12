-- AlterTable
ALTER TABLE "BusinessInfo" ADD COLUMN     "moneda" TEXT NOT NULL DEFAULT 'ARS',
ADD COLUMN     "formato_fecha" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
ADD COLUMN     "zona_horaria" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires';

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRate" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "seccion" TEXT,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "alias" TEXT,
    "cbu" TEXT,
    "numero_cuenta" TEXT,
    "banco" TEXT,
    "titular" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "conectado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSubscription" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "meses" INTEGER NOT NULL DEFAULT 1,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairStateRequest" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "estado_nombre" TEXT NOT NULL,
    "mensaje" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairStateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentMethod_empresa_id_idx" ON "PaymentMethod"("empresa_id");
CREATE INDEX "PaymentMethod_activo_idx" ON "PaymentMethod"("activo");
CREATE INDEX "TaxRate_empresa_id_idx" ON "TaxRate"("empresa_id");
CREATE INDEX "TaxRate_activo_idx" ON "TaxRate"("activo");
CREATE INDEX "BankAccount_empresa_id_idx" ON "BankAccount"("empresa_id");
CREATE UNIQUE INDEX "NotificationPreference_empresa_id_evento_key" ON "NotificationPreference"("empresa_id", "evento");
CREATE INDEX "NotificationPreference_empresa_id_idx" ON "NotificationPreference"("empresa_id");
CREATE UNIQUE INDEX "Integration_empresa_id_nombre_key" ON "Integration"("empresa_id", "nombre");
CREATE INDEX "Integration_empresa_id_idx" ON "Integration"("empresa_id");
CREATE UNIQUE INDEX "PlanSubscription_empresa_id_key" ON "PlanSubscription"("empresa_id");
CREATE INDEX "PlanSubscription_empresa_id_idx" ON "PlanSubscription"("empresa_id");
CREATE INDEX "PlanSubscription_plan_idx" ON "PlanSubscription"("plan");
CREATE INDEX "PlanSubscription_activo_idx" ON "PlanSubscription"("activo");
CREATE INDEX "RepairStateRequest_empresa_id_idx" ON "RepairStateRequest"("empresa_id");
CREATE INDEX "RepairStateRequest_estado_idx" ON "RepairStateRequest"("estado");

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRate" ADD CONSTRAINT "TaxRate_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSubscription" ADD CONSTRAINT "PlanSubscription_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairStateRequest" ADD CONSTRAINT "RepairStateRequest_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairStateRequest" ADD CONSTRAINT "RepairStateRequest_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

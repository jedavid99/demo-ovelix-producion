-- CreateTable
CREATE TABLE "WhatsAppSession" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "telefono" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'disconnected',
    "qr_code" TEXT,
    "qr_expires_at" TIMESTAMP(3),
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhatsAppSession_usuario_id_idx" ON "WhatsAppSession"("usuario_id");

-- CreateIndex
CREATE INDEX "WhatsAppSession_empresa_id_idx" ON "WhatsAppSession"("empresa_id");

-- CreateIndex
CREATE INDEX "WhatsAppSession_estado_idx" ON "WhatsAppSession"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppSession_usuario_id_empresa_id_key" ON "WhatsAppSession"("usuario_id", "empresa_id");

-- AddForeignKey
ALTER TABLE "WhatsAppSession" ADD CONSTRAINT "WhatsAppSession_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppSession" ADD CONSTRAINT "WhatsAppSession_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

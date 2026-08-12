-- CreateTable
CREATE TABLE "MensajeWhatsapp" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "numero_telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "archivo_url" TEXT,
    "whatsapp_message_id" TEXT,
    "fecha_envio" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MensajeWhatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "entidad_id" TEXT,
    "entidad_tipo" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MensajeWhatsapp_cliente_id_idx" ON "MensajeWhatsapp"("cliente_id");

-- CreateIndex
CREATE INDEX "MensajeWhatsapp_fecha_envio_idx" ON "MensajeWhatsapp"("fecha_envio");

-- CreateIndex
CREATE INDEX "Notification_usuario_id_idx" ON "Notification"("usuario_id");

-- CreateIndex
CREATE INDEX "Notification_leida_idx" ON "Notification"("leida");

-- CreateIndex
CREATE INDEX "Notification_tipo_idx" ON "Notification"("tipo");

-- CreateIndex
CREATE INDEX "Notification_created_at_idx" ON "Notification"("created_at");

-- AddForeignKey
ALTER TABLE "MensajeWhatsapp" ADD CONSTRAINT "MensajeWhatsapp_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

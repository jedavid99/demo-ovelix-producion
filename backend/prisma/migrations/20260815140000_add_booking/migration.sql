-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "dispositivo" TEXT,
    "servicio" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horario" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_empresa_id_idx" ON "Booking"("empresa_id");

-- CreateIndex
CREATE INDEX "Booking_fecha_idx" ON "Booking"("fecha");

-- CreateIndex
CREATE INDEX "Booking_estado_idx" ON "Booking"("estado");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

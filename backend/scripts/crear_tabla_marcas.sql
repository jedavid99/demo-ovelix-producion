-- Script SQL para crear la tabla de marcas
-- Ejecutar en Supabase/PostgreSQL

CREATE TABLE IF NOT EXISTS "Brand" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- Crear índice único para nombre + empresa_id
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_nombre_empresa_id_key" ON "Brand"("nombre", "empresa_id");

-- Crear índices para empresa_id y nombre
CREATE INDEX IF NOT EXISTS "Brand_empresa_id_idx" ON "Brand"("empresa_id");
CREATE INDEX IF NOT EXISTS "Brand_nombre_idx" ON "Brand"("nombre");

-- Crear foreign key hacia Company
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_empresa_id_fkey" 
    FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Comentario sobre la tabla
COMMENT ON TABLE "Brand" IS 'Tabla de marcas de dispositivos por empresa';

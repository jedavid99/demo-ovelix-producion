-- AlterTable: StockItem new fields
ALTER TABLE "StockItem" ADD COLUMN IF NOT EXISTS "imagen_url" TEXT;
ALTER TABLE "StockItem" ADD COLUMN IF NOT EXISTS "proveedor_nombre" TEXT;
ALTER TABLE "StockItem" ADD COLUMN IF NOT EXISTS "tipo_producto" TEXT NOT NULL DEFAULT 'repuesto';
ALTER TABLE "StockItem" ADD COLUMN IF NOT EXISTS "tipo_precio" TEXT NOT NULL DEFAULT 'minorista';
ALTER TABLE "StockItem" ADD COLUMN IF NOT EXISTS "canales_venta" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "StockItem" ADD COLUMN IF NOT EXISTS "es_por_encargo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "StockItem" ADD COLUMN IF NOT EXISTS "codigo_barra" TEXT;

-- AlterTable: BusinessInfo
ALTER TABLE "BusinessInfo" ADD COLUMN IF NOT EXISTS "margen_porcentaje" JSONB NOT NULL DEFAULT '[10,20,30,50]';

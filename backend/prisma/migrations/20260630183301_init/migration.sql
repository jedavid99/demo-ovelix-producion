-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DESARROLLADOR', 'ADMIN', 'TECNICO', 'RECEPCIONISTA', 'VENTAS');

-- CreateEnum
CREATE TYPE "RepairStatus" AS ENUM ('PENDING', 'DIAGNOSTIC', 'IN_PROGRESS', 'WAITING_PARTS', 'READY', 'DELIVERED', 'CANCELLED', 'BUDGET_REJECTED');

-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "codigo_empresa" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "provincia" TEXT,
    "codigo_postal" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT,
    "telefono" TEXT,
    "rol" "Role" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "empresa_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT NOT NULL,
    "dni" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "provincia" TEXT,
    "codigo_postal" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "deuda_actual" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "limite_credito" DECIMAL(10,2),
    "notas" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),
    "empresa_id" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repair" (
    "id" TEXT NOT NULL,
    "numero_reparacion" TEXT,
    "cliente_id" TEXT NOT NULL,
    "categoria_dispositivo" TEXT,
    "dispositivo" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "numero_serie" TEXT,
    "condicion_estetica" TEXT,
    "accesorios_incluidos" TEXT[],
    "tipo_seguridad" TEXT,
    "pin_acceso" TEXT,
    "patron_puntos" INTEGER[],
    "secuencia_patron" INTEGER[],
    "problema_reportado" TEXT NOT NULL,
    "diagnosis" TEXT,
    "reparacion_realizada" TEXT,
    "chequeo_hardware" JSONB,
    "estado" "RepairStatus" NOT NULL DEFAULT 'PENDING',
    "prioridad" TEXT,
    "tecnico_asignado_id" TEXT,
    "fecha_ingreso" TIMESTAMP(3) NOT NULL,
    "hora_ingreso" TEXT,
    "fecha_estimada_entrega" TIMESTAMP(3),
    "tiempo_estimado_minutos" INTEGER,
    "fecha_entrega" TIMESTAMP(3),
    "total_reparacion" DECIMAL(10,2),
    "metodo_pago_id" TEXT,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "costo_piezas" DECIMAL(10,2),
    "costo_mano_obra" DECIMAL(10,2),
    "garantia_meses" INTEGER,
    "notas" TEXT,
    "fotos_antes" TEXT[],
    "fotos_despues" TEXT[],
    "reparacion_origen_id" TEXT,
    "whatsapp_notificado" BOOLEAN NOT NULL DEFAULT false,
    "empresa_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "reparacion_id" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" "BudgetStatus" NOT NULL DEFAULT 'PENDING',
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_respuesta" TIMESTAMP(3),
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairPart" (
    "id" TEXT NOT NULL,
    "reparacion_id" TEXT NOT NULL,
    "repuesto_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "costo_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "RepairPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockItem" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "stock_maximo" INTEGER,
    "costo_unitario" DECIMAL(10,2) NOT NULL,
    "precio_venta" DECIMAL(10,2) NOT NULL,
    "proveedor_id" TEXT,
    "ubicacion_almacen" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "empresa_id" TEXT NOT NULL,
    "fecha_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),
    "ultima_compra" TIMESTAMP(3),
    "notas" TEXT,

    CONSTRAINT "StockItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "referencia_id" TEXT,
    "usuario_id" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cliente_id" TEXT,
    "empresa_id" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "monto_recibido" DECIMAL(10,2) NOT NULL,
    "cambio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "numero_comprobante" TEXT,
    "vendedor_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'completada',
    "reparacion_id" TEXT,
    "cierre_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "producto_nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashClosing" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "store_id" TEXT NOT NULL,
    "cashier" TEXT NOT NULL,
    "expected_balance" DECIMAL(10,2) NOT NULL,
    "actual_balance" DECIMAL(10,2) NOT NULL,
    "discrepancy" DECIMAL(10,2) NOT NULL,
    "transactions_count" INTEGER NOT NULL,
    "bills_count" JSONB NOT NULL,
    "notes" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'abierto',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashClosing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInfo" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre_negocio" TEXT NOT NULL,
    "propietario_nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "sitio_web" TEXT,
    "logo_url" TEXT,
    "descripcion" TEXT NOT NULL,
    "horarios" JSONB NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "empresa_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidad_id" TEXT,
    "datos_antiguos" JSONB,
    "datos_nuevos" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresa_id" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_codigo_empresa_key" ON "Company"("codigo_empresa");

-- CreateIndex
CREATE INDEX "Company_codigo_empresa_idx" ON "Company"("codigo_empresa");

-- CreateIndex
CREATE INDEX "Company_activo_idx" ON "Company"("activo");

-- CreateIndex
CREATE INDEX "User_empresa_id_idx" ON "User"("empresa_id");

-- CreateIndex
CREATE INDEX "User_rol_idx" ON "User"("rol");

-- CreateIndex
CREATE INDEX "User_activo_idx" ON "User"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_empresa_id_key" ON "User"("email", "empresa_id");

-- CreateIndex
CREATE INDEX "RefreshToken_usuario_id_idx" ON "RefreshToken"("usuario_id");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "Client_empresa_id_idx" ON "Client"("empresa_id");

-- CreateIndex
CREATE INDEX "Client_telefono_idx" ON "Client"("telefono");

-- CreateIndex
CREATE INDEX "Client_estado_idx" ON "Client"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Repair_numero_reparacion_key" ON "Repair"("numero_reparacion");

-- CreateIndex
CREATE INDEX "Repair_empresa_id_idx" ON "Repair"("empresa_id");

-- CreateIndex
CREATE INDEX "Repair_cliente_id_idx" ON "Repair"("cliente_id");

-- CreateIndex
CREATE INDEX "Repair_tecnico_asignado_id_idx" ON "Repair"("tecnico_asignado_id");

-- CreateIndex
CREATE INDEX "Repair_estado_idx" ON "Repair"("estado");

-- CreateIndex
CREATE INDEX "Repair_fecha_ingreso_idx" ON "Repair"("fecha_ingreso");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_numero_key" ON "Budget"("numero");

-- CreateIndex
CREATE INDEX "Budget_reparacion_id_idx" ON "Budget"("reparacion_id");

-- CreateIndex
CREATE INDEX "Budget_estado_idx" ON "Budget"("estado");

-- CreateIndex
CREATE INDEX "RepairPart_reparacion_id_idx" ON "RepairPart"("reparacion_id");

-- CreateIndex
CREATE INDEX "StockItem_empresa_id_idx" ON "StockItem"("empresa_id");

-- CreateIndex
CREATE INDEX "StockItem_categoria_idx" ON "StockItem"("categoria");

-- CreateIndex
CREATE INDEX "StockItem_estado_idx" ON "StockItem"("estado");

-- CreateIndex
CREATE INDEX "StockItem_stock_actual_idx" ON "StockItem"("stock_actual");

-- CreateIndex
CREATE UNIQUE INDEX "StockItem_codigo_empresa_id_key" ON "StockItem"("codigo", "empresa_id");

-- CreateIndex
CREATE INDEX "StockMovement_item_id_idx" ON "StockMovement"("item_id");

-- CreateIndex
CREATE INDEX "StockMovement_fecha_idx" ON "StockMovement"("fecha");

-- CreateIndex
CREATE INDEX "StockMovement_tipo_idx" ON "StockMovement"("tipo");

-- CreateIndex
CREATE INDEX "Sale_empresa_id_idx" ON "Sale"("empresa_id");

-- CreateIndex
CREATE INDEX "Sale_cliente_id_idx" ON "Sale"("cliente_id");

-- CreateIndex
CREATE INDEX "Sale_vendedor_id_idx" ON "Sale"("vendedor_id");

-- CreateIndex
CREATE INDEX "Sale_fecha_idx" ON "Sale"("fecha");

-- CreateIndex
CREATE INDEX "Sale_estado_idx" ON "Sale"("estado");

-- CreateIndex
CREATE INDEX "SaleItem_sale_id_idx" ON "SaleItem"("sale_id");

-- CreateIndex
CREATE INDEX "CashClosing_store_id_idx" ON "CashClosing"("store_id");

-- CreateIndex
CREATE INDEX "CashClosing_date_idx" ON "CashClosing"("date");

-- CreateIndex
CREATE INDEX "CashClosing_estado_idx" ON "CashClosing"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo_empresa_id_key" ON "BusinessInfo"("empresa_id");

-- CreateIndex
CREATE INDEX "BusinessInfo_empresa_id_idx" ON "BusinessInfo"("empresa_id");

-- CreateIndex
CREATE INDEX "Category_empresa_id_idx" ON "Category"("empresa_id");

-- CreateIndex
CREATE INDEX "Category_nombre_idx" ON "Category"("nombre");

-- CreateIndex
CREATE INDEX "AuditLog_empresa_id_idx" ON "AuditLog"("empresa_id");

-- CreateIndex
CREATE INDEX "AuditLog_usuario_id_idx" ON "AuditLog"("usuario_id");

-- CreateIndex
CREATE INDEX "AuditLog_entidad_idx" ON "AuditLog"("entidad");

-- CreateIndex
CREATE INDEX "AuditLog_fecha_idx" ON "AuditLog"("fecha");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repair" ADD CONSTRAINT "Repair_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repair" ADD CONSTRAINT "Repair_tecnico_asignado_id_fkey" FOREIGN KEY ("tecnico_asignado_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repair" ADD CONSTRAINT "Repair_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "Repair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairPart" ADD CONSTRAINT "RepairPart_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "Repair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairPart" ADD CONSTRAINT "RepairPart_repuesto_id_fkey" FOREIGN KEY ("repuesto_id") REFERENCES "StockItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockItem" ADD CONSTRAINT "StockItem_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockItem" ADD CONSTRAINT "StockItem_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "StockItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "StockItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashClosing" ADD CONSTRAINT "CashClosing_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashClosing" ADD CONSTRAINT "CashClosing_cashier_fkey" FOREIGN KEY ("cashier") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInfo" ADD CONSTRAINT "BusinessInfo_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Modelos de dispositivos: cada modelo pertenece a una marca (relación 1-N)
CREATE TABLE "DeviceModel" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca_id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceModel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeviceModel_nombre_marca_id_key" ON "DeviceModel"("nombre", "marca_id");
CREATE INDEX "DeviceModel_marca_id_idx" ON "DeviceModel"("marca_id");
CREATE INDEX "DeviceModel_empresa_id_idx" ON "DeviceModel"("empresa_id");

ALTER TABLE "DeviceModel" ADD CONSTRAINT "DeviceModel_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeviceModel" ADD CONSTRAINT "DeviceModel_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Relación muchos-a-muchos: RepairCost ↔ Brand
CREATE TABLE "_BrandToRepairCost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE INDEX "_BrandToRepairCost_B_index" ON "_BrandToRepairCost"("B");
CREATE UNIQUE INDEX "_BrandToRepairCost_AB_unique" ON "_BrandToRepairCost"("A", "B");

ALTER TABLE "_BrandToRepairCost" ADD CONSTRAINT "_BrandToRepairCost_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_BrandToRepairCost" ADD CONSTRAINT "_BrandToRepairCost_B_fkey" FOREIGN KEY ("B") REFERENCES "RepairCost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Relación muchos-a-muchos: RepairCost ↔ DeviceModel
CREATE TABLE "_DeviceModelToRepairCost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE INDEX "_DeviceModelToRepairCost_B_index" ON "_DeviceModelToRepairCost"("B");
CREATE UNIQUE INDEX "_DeviceModelToRepairCost_AB_unique" ON "_DeviceModelToRepairCost"("A", "B");

ALTER TABLE "_DeviceModelToRepairCost" ADD CONSTRAINT "_DeviceModelToRepairCost_A_fkey" FOREIGN KEY ("A") REFERENCES "DeviceModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DeviceModelToRepairCost" ADD CONSTRAINT "_DeviceModelToRepairCost_B_fkey" FOREIGN KEY ("B") REFERENCES "RepairCost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
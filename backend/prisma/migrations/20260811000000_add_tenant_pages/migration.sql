-- CreateTable
CREATE TABLE "TenantPage" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantPage_empresa_id_key" ON "TenantPage"("empresa_id");
CREATE INDEX "TenantPage_empresa_id_idx" ON "TenantPage"("empresa_id");

-- AddForeignKey
ALTER TABLE "TenantPage" ADD CONSTRAINT "TenantPage_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
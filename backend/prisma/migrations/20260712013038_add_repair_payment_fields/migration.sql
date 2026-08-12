/*
  Warnings:

  - You are about to drop the column `rol` on the `User` table. All the data in the column will be lost.
  - Added the required column `rol_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_rol_idx";

-- AlterTable
ALTER TABLE "Repair" ADD COLUMN     "abono" DECIMAL(10,2),
ADD COLUMN     "costo_estimado" DECIMAL(10,2),
ADD COLUMN     "forma_pago" TEXT,
ADD COLUMN     "margen_porcentaje" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rol",
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rol_id" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "permissions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerLog" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "variables" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "variables" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "ServerLog_level_idx" ON "ServerLog"("level");

-- CreateIndex
CREATE INDEX "ServerLog_module_idx" ON "ServerLog"("module");

-- CreateIndex
CREATE INDEX "ServerLog_timestamp_idx" ON "ServerLog"("timestamp");

-- CreateIndex
CREATE INDEX "EmailTemplate_type_idx" ON "EmailTemplate"("type");

-- CreateIndex
CREATE INDEX "EmailTemplate_active_idx" ON "EmailTemplate"("active");

-- CreateIndex
CREATE INDEX "WhatsAppTemplate_type_idx" ON "WhatsAppTemplate"("type");

-- CreateIndex
CREATE INDEX "WhatsAppTemplate_active_idx" ON "WhatsAppTemplate"("active");

-- CreateIndex
CREATE INDEX "User_rol_id_idx" ON "User"("rol_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `salonId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salonId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_clientId_fkey";

-- AlterTable
ALTER TABLE "public"."Inventory" ADD COLUMN     "salonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "salonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "salonId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Salon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Salon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Config" (
    "id" SERIAL NOT NULL,
    "salonId" INTEGER NOT NULL,
    "requireConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "workersCanCreateServices" BOOLEAN NOT NULL DEFAULT false,
    "canAcceptAppointments" BOOLEAN NOT NULL DEFAULT true,
    "canModifyAppointments" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "salonId" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "salonId" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Salon_adminId_key" ON "public"."Salon"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Config_salonId_key" ON "public"."Config"("salonId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Salon" ADD CONSTRAINT "Salon_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Config" ADD CONSTRAINT "Config_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventory" ADD CONSTRAINT "Inventory_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

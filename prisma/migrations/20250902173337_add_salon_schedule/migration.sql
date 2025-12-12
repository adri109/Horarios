-- AlterTable
ALTER TABLE "public"."Config" ADD COLUMN     "closingTime" TEXT NOT NULL DEFAULT '18:00',
ADD COLUMN     "openingTime" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN     "serviceIntervalMinutes" INTEGER NOT NULL DEFAULT 30;

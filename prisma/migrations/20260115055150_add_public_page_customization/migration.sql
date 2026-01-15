-- AlterTable
ALTER TABLE "public"."Config" ADD COLUMN     "publicPageBackground" TEXT DEFAULT 'gradient-to-br from-purple-50 via-pink-50 to-purple-100',
ADD COLUMN     "publicPagePrimaryColor" TEXT DEFAULT '#9333ea',
ADD COLUMN     "publicPageSecondaryColor" TEXT DEFAULT '#ec4899';

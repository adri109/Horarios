-- CreateTable
CREATE TABLE "public"."SalonSchedule" (
    "id" SERIAL NOT NULL,
    "salonId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SalonSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScheduleBlock" (
    "id" SERIAL NOT NULL,
    "salonId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalonSchedule_salonId_dayOfWeek_key" ON "public"."SalonSchedule"("salonId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "public"."SalonSchedule" ADD CONSTRAINT "SalonSchedule_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduleBlock" ADD CONSTRAINT "ScheduleBlock_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

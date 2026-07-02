-- CreateEnum
CREATE TYPE "CheckInTiming" AS ENUM ('EARLY', 'ON_TIME', 'LATE');

-- CreateEnum
CREATE TYPE "CheckOutTiming" AS ENUM ('ON_TIME', 'AFTER_HOURS');

-- AlterTable
ALTER TABLE "AttendanceRecord" ADD COLUMN "checkInTiming" "CheckInTiming",
ADD COLUMN "checkOutTiming" "CheckOutTiming";

-- CreateTable
CREATE TABLE "AttendanceSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "startHour" INTEGER NOT NULL DEFAULT 9,
    "startMinute" INTEGER NOT NULL DEFAULT 0,
    "endHour" INTEGER NOT NULL DEFAULT 19,
    "endMinute" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "AttendanceSettings" ("id", "startHour", "startMinute", "endHour", "endMinute", "updatedAt")
VALUES ('default', 9, 0, 19, 0, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

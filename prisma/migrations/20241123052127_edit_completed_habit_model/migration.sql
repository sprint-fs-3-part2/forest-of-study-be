/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CompletedHabit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CompletedHabit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompletedHabit" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "completedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

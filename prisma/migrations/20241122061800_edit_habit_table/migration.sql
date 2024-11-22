/*
  Warnings:

  - You are about to drop the column `completed` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Habit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "completed",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "Habit_studyId_idx" ON "Habit"("studyId");

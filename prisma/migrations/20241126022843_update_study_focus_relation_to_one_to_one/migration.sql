/*
  Warnings:

  - You are about to drop the column `endTime` on the `Focus` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Focus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studyId]` on the table `Focus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Focus" DROP COLUMN "endTime",
DROP COLUMN "startTime";

-- CreateIndex
CREATE UNIQUE INDEX "Focus_studyId_key" ON "Focus"("studyId");

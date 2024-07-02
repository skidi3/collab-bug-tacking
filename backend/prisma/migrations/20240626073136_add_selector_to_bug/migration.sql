/*
  Warnings:

  - You are about to drop the column `elector` on the `Bug` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bug" DROP COLUMN "elector",
ADD COLUMN     "selector" TEXT;

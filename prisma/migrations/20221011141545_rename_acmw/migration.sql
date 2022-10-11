/*
  Warnings:

  - You are about to drop the column `isInAMCW` on the `MemberData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MemberData" DROP COLUMN "isInAMCW",
ADD COLUMN     "isInACMW" BOOLEAN,
ALTER COLUMN "Birthday" SET DATA TYPE TEXT;

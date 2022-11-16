/*
  Warnings:

  - You are about to drop the column `shortID` on the `Member` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Member_shortID_key";

ALTER TABLE "Member" DROP COLUMN "shortID";

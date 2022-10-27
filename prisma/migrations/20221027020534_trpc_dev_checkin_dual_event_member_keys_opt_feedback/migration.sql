/*
  Warnings:

  - The primary key for the `Checkins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Checkins` table. All the data in the column will be lost.
  - Added the required column `eventID` to the `Checkins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checkins" DROP CONSTRAINT "Checkins_pkey",
DROP COLUMN "id",
ADD COLUMN     "eventID" TEXT NOT NULL,
ALTER COLUMN "feedback" DROP NOT NULL,
ADD CONSTRAINT "Checkins_pkey" PRIMARY KEY ("eventID", "memberID");

-- AddForeignKey
ALTER TABLE "Checkins" ADD CONSTRAINT "Checkins_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

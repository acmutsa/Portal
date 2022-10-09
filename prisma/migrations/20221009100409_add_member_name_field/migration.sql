/*
  Warnings:

  - Added the required column `name` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "name" TEXT NOT NULL;

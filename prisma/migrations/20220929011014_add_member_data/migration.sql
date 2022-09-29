/*
  Warnings:

  - You are about to drop the column `extendedUserData` on the `Member` table. All the data in the column will be lost.
  - Added the required column `extendedMemberData` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "MemberData" (
    "memberID" TEXT NOT NULL PRIMARY KEY,
    "major" TEXT,
    "classification" TEXT,
    "graduationDate" TEXT,
    "shirtIsUnisex" BOOLEAN,
    "shirtSize" TEXT,
    "Birthday" DATETIME,
    "isInACM" BOOLEAN,
    "isInAMCW" BOOLEAN,
    "isInRC" BOOLEAN,
    "isInICPC" BOOLEAN,
    "isInCIC" BOOLEAN,
    "isBlackorAA" BOOLEAN,
    "isAsian" BOOLEAN,
    "isNAorAN" BOOLEAN,
    "isNHorPI" BOOLEAN,
    "isHispanicorLatinx" BOOLEAN,
    "isWhite" BOOLEAN,
    "isMale" BOOLEAN,
    "isFemale" BOOLEAN,
    "isNonBinary" BOOLEAN,
    "isTransgender" BOOLEAN,
    "isIntersex" BOOLEAN,
    "doesNotIdentify" BOOLEAN,
    "otherIdentity" TEXT,
    "address" TEXT,
    CONSTRAINT "MemberData_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "shortID" TEXT NOT NULL,
    "attendanceCount" INTEGER NOT NULL,
    "joinDate" DATETIME NOT NULL,
    "extendedMemberData" TEXT NOT NULL
);
INSERT INTO "new_Member" ("attendanceCount", "email", "id", "joinDate", "shortID") SELECT "attendanceCount", "email", "id", "joinDate", "shortID" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");
CREATE UNIQUE INDEX "Member_shortID_key" ON "Member"("shortID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

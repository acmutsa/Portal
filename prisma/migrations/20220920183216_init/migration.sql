-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "headerImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventStart" DATETIME NOT NULL,
    "eventEnd" DATETIME NOT NULL,
    "formOpen" DATETIME NOT NULL,
    "formClose" DATETIME NOT NULL,
    "hasBeenForced" BOOLEAN NOT NULL DEFAULT false,
    "forcedIsOpen" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Checkins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberID" TEXT NOT NULL,
    "isInPerson" BOOLEAN NOT NULL,
    "feedback" TEXT NOT NULL,
    CONSTRAINT "Checkins_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "shortID" TEXT NOT NULL,
    "attendanceCount" INTEGER NOT NULL,
    "joinDate" DATETIME NOT NULL,
    "extendedUserData" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_shortID_key" ON "Member"("shortID");

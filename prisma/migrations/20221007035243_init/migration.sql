-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "headerImage" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventStart" TIMESTAMP(3) NOT NULL,
    "eventEnd" TIMESTAMP(3) NOT NULL,
    "formOpen" TIMESTAMP(3) NOT NULL,
    "formClose" TIMESTAMP(3) NOT NULL,
    "hasBeenForced" BOOLEAN NOT NULL DEFAULT false,
    "forcedIsOpen" BOOLEAN NOT NULL DEFAULT false,
    "pageID" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkins" (
    "id" TEXT NOT NULL,
    "memberID" TEXT NOT NULL,
    "isInPerson" BOOLEAN NOT NULL,
    "feedback" TEXT NOT NULL,

    CONSTRAINT "Checkins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "shortID" TEXT NOT NULL,
    "attendanceCount" INTEGER NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "extendedMemberData" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberData" (
    "memberID" TEXT NOT NULL,
    "major" TEXT,
    "classification" TEXT,
    "graduationDate" TEXT,
    "shirtIsUnisex" BOOLEAN,
    "shirtSize" TEXT,
    "Birthday" TIMESTAMP(3),
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

    CONSTRAINT "MemberData_pkey" PRIMARY KEY ("memberID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Events_pageID_key" ON "Events"("pageID");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_shortID_key" ON "Member"("shortID");

-- AddForeignKey
ALTER TABLE "Checkins" ADD CONSTRAINT "Checkins_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberData" ADD CONSTRAINT "MemberData_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

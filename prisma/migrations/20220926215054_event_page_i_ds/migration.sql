-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Events" (
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
    "forcedIsOpen" BOOLEAN NOT NULL DEFAULT false,
    "pageID" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Events" ("createdAt", "description", "eventEnd", "eventStart", "forcedIsOpen", "formClose", "formOpen", "hasBeenForced", "headerImage", "id", "name", "organization") SELECT "createdAt", "description", "eventEnd", "eventStart", "forcedIsOpen", "formClose", "formOpen", "hasBeenForced", "headerImage", "id", "name", "organization" FROM "Events";
DROP TABLE "Events";
ALTER TABLE "new_Events" RENAME TO "Events";
CREATE UNIQUE INDEX "Events_pageID_key" ON "Events"("pageID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

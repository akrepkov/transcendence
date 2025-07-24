/*
  Warnings:

  - You are about to drop the column `games` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_GameToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GameToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("gameId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("avatar", "createdAt", "email", "losses", "password", "rank", "userId", "username", "wins") SELECT "avatar", "createdAt", "email", "losses", "password", "rank", "userId", "username", "wins" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_GameToUser_AB_unique" ON "_GameToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToUser_B_index" ON "_GameToUser"("B");

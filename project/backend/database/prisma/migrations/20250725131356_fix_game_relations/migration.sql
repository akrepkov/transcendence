/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `losses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_GameToUser_B_index";

-- DropIndex
DROP INDEX "_GameToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Game";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GameToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Pong" (
    "gameId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Snake" (
    "gameId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_PongToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PongToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Pong" ("gameId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PongToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SnakeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SnakeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Snake" ("gameId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SnakeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "pongWins" INTEGER NOT NULL DEFAULT 0,
    "pongLosses" INTEGER NOT NULL DEFAULT 0,
    "snakeWins" INTEGER NOT NULL DEFAULT 0,
    "snakeLosses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("avatar", "createdAt", "email", "password", "userId", "username") SELECT "avatar", "createdAt", "email", "password", "userId", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_PongToUser_AB_unique" ON "_PongToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PongToUser_B_index" ON "_PongToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SnakeToUser_AB_unique" ON "_SnakeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SnakeToUser_B_index" ON "_SnakeToUser"("B");

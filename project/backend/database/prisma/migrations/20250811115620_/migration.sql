/*
  Warnings:

  - You are about to drop the column `player1Id` on the `Pong` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Pong` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Pong` table. All the data in the column will be lost.
  - You are about to drop the column `player1Id` on the `Snake` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Snake` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Snake` table. All the data in the column will be lost.
  - Added the required column `player1Name` to the `Pong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Name` to the `Pong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerName` to the `Pong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1Name` to the `Snake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Name` to the `Snake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerName` to the `Snake` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pong" (
    "gameId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Name" TEXT NOT NULL,
    "player2Name" TEXT NOT NULL,
    "winnerName" TEXT NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pong" ("createdAt", "gameId", "player1Score", "player2Score") SELECT "createdAt", "gameId", "player1Score", "player2Score" FROM "Pong";
DROP TABLE "Pong";
ALTER TABLE "new_Pong" RENAME TO "Pong";
CREATE TABLE "new_Snake" (
    "gameId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Name" TEXT NOT NULL,
    "player2Name" TEXT NOT NULL,
    "winnerName" TEXT NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Snake" ("createdAt", "gameId", "player1Score", "player2Score") SELECT "createdAt", "gameId", "player1Score", "player2Score" FROM "Snake";
DROP TABLE "Snake";
ALTER TABLE "new_Snake" RENAME TO "Snake";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

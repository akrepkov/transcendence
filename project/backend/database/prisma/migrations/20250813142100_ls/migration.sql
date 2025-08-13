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
    "tournamentWins" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("avatar", "createdAt", "email", "password", "pongLosses", "pongWins", "snakeLosses", "snakeWins", "userId", "username") SELECT "avatar", "createdAt", "email", "password", "pongLosses", "pongWins", "snakeLosses", "snakeWins", "userId", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

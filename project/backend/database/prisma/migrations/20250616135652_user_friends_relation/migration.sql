-- DropIndex
DROP INDEX "User_password_key";

-- CreateTable
CREATE TABLE "_UserFriends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON "_UserFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "_UserFriends"("B");

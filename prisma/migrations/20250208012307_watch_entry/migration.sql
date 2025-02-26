/*
  Warnings:

  - You are about to drop the column `userEmail` on the `WatchEntry` table. All the data in the column will be lost.
  - Added the required column `userId` to the `WatchEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WatchEntry" DROP CONSTRAINT "WatchEntry_userEmail_fkey";

-- AlterTable
ALTER TABLE "WatchEntry" DROP COLUMN "userEmail",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WatchEntry" ADD CONSTRAINT "WatchEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

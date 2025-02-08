-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'SERIES');

-- CreateTable
CREATE TABLE "WatchEntry" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "season" INTEGER,
    "episode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatchEntry" ADD CONSTRAINT "WatchEntry_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

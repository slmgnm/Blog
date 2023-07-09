/*
  Warnings:

  - You are about to drop the column `message` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Added the required column `title` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "message",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ALTER COLUMN "title" SET DATA TYPE TEXT;

/*
  Warnings:

  - You are about to drop the column `groupName` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "groupName",
ADD COLUMN     "group" TEXT,
ADD COLUMN     "videoUrl" TEXT;

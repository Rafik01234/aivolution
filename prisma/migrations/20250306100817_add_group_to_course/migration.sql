/*
  Warnings:

  - You are about to drop the `CourseGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseGroup" DROP CONSTRAINT "CourseGroup_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "group" TEXT;

-- DropTable
DROP TABLE "CourseGroup";

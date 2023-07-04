/*
  Warnings:

  - You are about to drop the column `reqCode` on the `Requirement` table. All the data in the column will be lost.
  - You are about to drop the column `testCaseCode` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `testPlanCode` on the `TestPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Requirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `TestPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Requirement_reqCode_key";

-- DropIndex
DROP INDEX "TestCase_testCaseCode_key";

-- DropIndex
DROP INDEX "TestPlan_testPlanCode_key";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "env" SET DATA TYPE TEXT,
ALTER COLUMN "tools" SET DATA TYPE TEXT,
ALTER COLUMN "version" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Requirement" DROP COLUMN "reqCode",
ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "testCaseCode",
ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "precondition" SET DATA TYPE TEXT,
ALTER COLUMN "steps" SET DATA TYPE TEXT,
ALTER COLUMN "data" SET DATA TYPE TEXT,
ALTER COLUMN "expected" SET DATA TYPE TEXT,
ALTER COLUMN "script" SET DATA TYPE TEXT,
ALTER COLUMN "result" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TestPlan" DROP COLUMN "testPlanCode",
ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

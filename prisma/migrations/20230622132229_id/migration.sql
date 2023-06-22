/*
  Warnings:

  - You are about to drop the column `reqId` on the `Requirement` table. All the data in the column will be lost.
  - You are about to drop the column `testCaseId` on the `TestCase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reqCode]` on the table `Requirement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[testCaseCode]` on the table `TestCase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[testPlanCode]` on the table `TestPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reqCode` to the `Requirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testCaseCode` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testPlanCode` to the `TestPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Requirement_reqId_key";

-- DropIndex
DROP INDEX "TestCase_testCaseId_key";

-- AlterTable
ALTER TABLE "Requirement" DROP COLUMN "reqId",
ADD COLUMN     "reqCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "testCaseId",
ADD COLUMN     "testCaseCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestPlan" ADD COLUMN     "testPlanCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Requirement_reqCode_key" ON "Requirement"("reqCode");

-- CreateIndex
CREATE UNIQUE INDEX "TestCase_testCaseCode_key" ON "TestCase"("testCaseCode");

-- CreateIndex
CREATE UNIQUE INDEX "TestPlan_testPlanCode_key" ON "TestPlan"("testPlanCode");

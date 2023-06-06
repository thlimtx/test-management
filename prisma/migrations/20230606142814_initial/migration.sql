/*
  Warnings:

  - Added the required column `projectId` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "projectId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Build" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "description" TEXT,
    "script" TEXT,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildLog" (
    "id" SERIAL NOT NULL,
    "buildId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" TEXT NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "BuildLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deploy" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "description" TEXT,
    "script" TEXT,

    CONSTRAINT "Deploy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeployLog" (
    "id" SERIAL NOT NULL,
    "deployId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" TEXT NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "DeployLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Build_projectId_key" ON "Build"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Deploy_projectId_key" ON "Deploy"("projectId");

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildLog" ADD CONSTRAINT "BuildLog_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deploy" ADD CONSTRAINT "Deploy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeployLog" ADD CONSTRAINT "DeployLog_deployId_fkey" FOREIGN KEY ("deployId") REFERENCES "Deploy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

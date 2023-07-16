-- CreateEnum
CREATE TYPE "DashboardView" AS ENUM ('TEST', 'ALL', 'GITHUB_ACITON');

-- CreateTable
CREATE TABLE "Config" (
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dashboardView" "DashboardView" NOT NULL DEFAULT 'ALL',
    "githubOwner" TEXT,
    "githubProject" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_projectId_key" ON "Config"("projectId");

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

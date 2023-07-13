/*
  Warnings:

  - You are about to drop the column `script` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `script` on the `Deploy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Build" DROP COLUMN "script",
ADD COLUMN     "getEndpoint" TEXT,
ADD COLUMN     "runEndpoint" TEXT,
ADD COLUMN     "token" TEXT;

-- AlterTable
ALTER TABLE "Deploy" DROP COLUMN "script",
ADD COLUMN     "getEndpoint" TEXT,
ADD COLUMN     "runEndpoint" TEXT,
ADD COLUMN     "token" TEXT;

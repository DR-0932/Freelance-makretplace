/*
  Warnings:

  - You are about to drop the column `description` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Proposal` table. All the data in the column will be lost.
  - Added the required column `coverLetter` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedDuration` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proposedPrice` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'open';

-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "coverLetter" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimatedDuration" TEXT NOT NULL,
ADD COLUMN     "proposedPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

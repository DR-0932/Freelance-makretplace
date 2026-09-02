/*
  Warnings:

  - You are about to drop the column `budget` on the `Project` table. All the data in the column will be lost.
  - Added the required column `budgetMax` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetMin` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "budget",
ADD COLUMN     "budgetMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "budgetMin" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;

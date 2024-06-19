/*
  Warnings:

  - You are about to drop the column `query` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project" DROP COLUMN "query",
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "negative_keywords" TEXT[];

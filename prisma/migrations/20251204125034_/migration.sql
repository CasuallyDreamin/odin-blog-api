/*
  Warnings:

  - You are about to drop the column `defaultLanguage` on the `Settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "defaultLanguage",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "postsPerPage" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "tagline" TEXT NOT NULL DEFAULT 'The best place for news.',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "theme" SET DEFAULT 'default',
ALTER COLUMN "blogName" SET DEFAULT 'My Awesome Blog';

-- CreateIndex
CREATE UNIQUE INDEX "Settings_id_key" ON "Settings"("id");

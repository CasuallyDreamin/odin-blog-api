/*
  Warnings:

  - You are about to drop the `_QuoteTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_QuoteTags" DROP CONSTRAINT "_QuoteTags_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_QuoteTags" DROP CONSTRAINT "_QuoteTags_B_fkey";

-- DropTable
DROP TABLE "public"."_QuoteTags";

-- CreateTable
CREATE TABLE "_QuoteCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QuoteCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_QuoteCategories_B_index" ON "_QuoteCategories"("B");

-- AddForeignKey
ALTER TABLE "_QuoteCategories" ADD CONSTRAINT "_QuoteCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuoteCategories" ADD CONSTRAINT "_QuoteCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

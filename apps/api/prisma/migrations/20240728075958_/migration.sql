/*
  Warnings:

  - A unique constraint covering the columns `[appId,telegram]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oa_users" ADD COLUMN     "telegram" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_telegram_key" ON "oa_users"("appId", "telegram");

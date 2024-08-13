/*
  Warnings:

  - A unique constraint covering the columns `[appId,tiktok]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oa_apps" ADD COLUMN     "tiktokClientKey" TEXT,
ADD COLUMN     "tiktokEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "oa_users" ADD COLUMN     "tiktok" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_tiktok_key" ON "oa_users"("appId", "tiktok");

/*
  Warnings:

  - A unique constraint covering the columns `[appId,discord]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oa_apps" ADD COLUMN     "discordEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "oa_users" ADD COLUMN     "discord" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_discord_key" ON "oa_users"("appId", "discord");

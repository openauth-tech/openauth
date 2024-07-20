/*
  Warnings:

  - A unique constraint covering the columns `[appId,username]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oa_users" ADD COLUMN     "password" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_username_key" ON "oa_users"("appId", "username");

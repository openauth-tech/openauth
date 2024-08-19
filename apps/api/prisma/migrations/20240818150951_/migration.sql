/*
  Warnings:

  - A unique constraint covering the columns `[appId,github]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oa_apps" ADD COLUMN     "githubClientId" TEXT,
ADD COLUMN     "githubClientSecret" TEXT,
ADD COLUMN     "githubEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "oa_users" ADD COLUMN     "github" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_github_key" ON "oa_users"("appId", "github");

/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `oa_apps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "oa_apps_secret_key" ON "oa_apps"("secret");

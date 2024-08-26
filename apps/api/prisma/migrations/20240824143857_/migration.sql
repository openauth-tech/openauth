/*
  Warnings:

  - A unique constraint covering the columns `[appId,huggingface]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oa_apps" ADD COLUMN     "huggingfaceAppSecret" TEXT,
ADD COLUMN     "huggingfaceClientId" TEXT,
ADD COLUMN     "huggingfaceEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "oa_users" ADD COLUMN     "huggingface" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_huggingface_key" ON "oa_users"("appId", "huggingface");

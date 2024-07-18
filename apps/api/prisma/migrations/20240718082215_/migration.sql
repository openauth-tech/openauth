/*
  Warnings:

  - You are about to drop the column `lastLoginTime` on the `oa_users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appId,referCode]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "oa_users_referCode_key";

-- AlterTable
ALTER TABLE "oa_users" DROP COLUMN "lastLoginTime",
ADD COLUMN     "lastSeenAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_referCode_key" ON "oa_users"("appId", "referCode");

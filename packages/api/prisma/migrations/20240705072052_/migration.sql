/*
  Warnings:

  - A unique constraint covering the columns `[referCode]` on the table `oa_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oa_users" ADD COLUMN     "referChain" TEXT,
ADD COLUMN     "referCode" TEXT;

-- CreateTable
CREATE TABLE "oa_referrals" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appId" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "referee" TEXT NOT NULL,

    CONSTRAINT "oa_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_referCode_key" ON "oa_users"("referCode");

-- AddForeignKey
ALTER TABLE "oa_referrals" ADD CONSTRAINT "oa_referrals_appId_fkey" FOREIGN KEY ("appId") REFERENCES "oa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

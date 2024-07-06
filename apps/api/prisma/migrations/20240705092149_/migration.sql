/*
  Warnings:

  - A unique constraint covering the columns `[referee]` on the table `oa_referrals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "oa_referrals_referee_key" ON "oa_referrals"("referee");

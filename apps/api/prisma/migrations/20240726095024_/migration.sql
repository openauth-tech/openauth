/*
  Warnings:

  - Made the column `referCode` on table `oa_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "oa_users" ALTER COLUMN "referCode" SET NOT NULL;

/*
  Warnings:

  - Made the column `lastSeenAt` on table `oa_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "oa_users" ALTER COLUMN "lastSeenAt" SET NOT NULL,
ALTER COLUMN "lastSeenAt" SET DEFAULT CURRENT_TIMESTAMP;

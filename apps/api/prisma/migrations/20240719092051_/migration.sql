-- AlterTable
ALTER TABLE "oa_admins" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "oa_apps" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "oa_apps" ADD COLUMN     "telegramBotToken" TEXT,
ADD COLUMN     "telegramEnabled" BOOLEAN NOT NULL DEFAULT false;

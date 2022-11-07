/*
  Warnings:

  - You are about to drop the column `telegram_chat_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegram_chat_id";

-- CreateTable
CREATE TABLE "TelegramProvider" (
    "walletAddress" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "chatId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TelegramProvider_walletAddress_appName_providerName_key" ON "TelegramProvider"("walletAddress", "appName", "providerName");

-- AddForeignKey
ALTER TABLE "TelegramProvider" ADD CONSTRAINT "TelegramProvider_walletAddress_appName_fkey" FOREIGN KEY ("walletAddress", "appName") REFERENCES "User"("wallet_address", "app_name") ON DELETE CASCADE ON UPDATE CASCADE;

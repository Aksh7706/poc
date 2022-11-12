/*
  Warnings:

  - You are about to drop the column `app_name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `appName` on the `EventProviders` table. All the data in the column will be lost.
  - You are about to drop the column `eventName` on the `EventProviders` table. All the data in the column will be lost.
  - You are about to drop the column `providerName` on the `EventProviders` table. All the data in the column will be lost.
  - You are about to drop the column `app_name` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `appName` on the `TelegramProvider` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `TelegramProvider` table. All the data in the column will be lost.
  - You are about to drop the column `providerName` on the `TelegramProvider` table. All the data in the column will be lost.
  - You are about to drop the column `walletAddress` on the `TelegramProvider` table. All the data in the column will be lost.
  - You are about to drop the column `app_name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,owner_address]` on the table `App` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,app_id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[app_id,event_name,provider_name]` on the table `EventProviders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,app_id]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet_address,app_id,provider_name]` on the table `TelegramProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet_address,app_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_address` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `app_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `app_id` to the `EventProviders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_name` to the `EventProviders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_name` to the `EventProviders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `app_id` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `app_id` to the `TelegramProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chat_id` to the `TelegramProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_name` to the `TelegramProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_address` to the `TelegramProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `app_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_app_name_fkey";

-- DropForeignKey
ALTER TABLE "EventProviders" DROP CONSTRAINT "EventProviders_eventName_appName_fkey";

-- DropForeignKey
ALTER TABLE "EventProviders" DROP CONSTRAINT "EventProviders_providerName_appName_fkey";

-- DropForeignKey
ALTER TABLE "Provider" DROP CONSTRAINT "Provider_app_name_fkey";

-- DropForeignKey
ALTER TABLE "TelegramProvider" DROP CONSTRAINT "TelegramProvider_walletAddress_appName_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_app_name_fkey";

-- DropIndex
DROP INDEX "App_name_idx";

-- DropIndex
DROP INDEX "App_name_key";

-- DropIndex
DROP INDEX "Event_name_app_name_idx";

-- DropIndex
DROP INDEX "Event_name_app_name_key";

-- DropIndex
DROP INDEX "EventProviders_appName_eventName_providerName_key";

-- DropIndex
DROP INDEX "Provider_name_app_name_idx";

-- DropIndex
DROP INDEX "Provider_name_app_name_key";

-- DropIndex
DROP INDEX "TelegramProvider_walletAddress_appName_providerName_key";

-- DropIndex
DROP INDEX "User_wallet_address_app_name_idx";

-- DropIndex
DROP INDEX "User_wallet_address_app_name_key";

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "owner_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "app_name",
ADD COLUMN     "app_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventProviders" DROP COLUMN "appName",
DROP COLUMN "eventName",
DROP COLUMN "providerName",
ADD COLUMN     "app_id" TEXT NOT NULL,
ADD COLUMN     "event_name" TEXT NOT NULL,
ADD COLUMN     "provider_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "app_name",
ADD COLUMN     "app_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TelegramProvider" DROP COLUMN "appName",
DROP COLUMN "chatId",
DROP COLUMN "providerName",
DROP COLUMN "walletAddress",
ADD COLUMN     "app_id" TEXT NOT NULL,
ADD COLUMN     "chat_id" TEXT NOT NULL,
ADD COLUMN     "provider_name" TEXT NOT NULL,
ADD COLUMN     "wallet_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "app_name",
ADD COLUMN     "app_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "account_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_address_key" ON "Account"("account_address");

-- CreateIndex
CREATE INDEX "Account_account_address_idx" ON "Account"("account_address");

-- CreateIndex
CREATE INDEX "App_name_owner_address_idx" ON "App"("name", "owner_address");

-- CreateIndex
CREATE UNIQUE INDEX "App_name_owner_address_key" ON "App"("name", "owner_address");

-- CreateIndex
CREATE INDEX "Event_name_app_id_idx" ON "Event"("name", "app_id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_app_id_key" ON "Event"("name", "app_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventProviders_app_id_event_name_provider_name_key" ON "EventProviders"("app_id", "event_name", "provider_name");

-- CreateIndex
CREATE INDEX "Provider_name_app_id_idx" ON "Provider"("name", "app_id");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_app_id_key" ON "Provider"("name", "app_id");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramProvider_wallet_address_app_id_provider_name_key" ON "TelegramProvider"("wallet_address", "app_id", "provider_name");

-- CreateIndex
CREATE INDEX "User_wallet_address_app_id_idx" ON "User"("wallet_address", "app_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_address_app_id_key" ON "User"("wallet_address", "app_id");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_owner_address_fkey" FOREIGN KEY ("owner_address") REFERENCES "Account"("account_address") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramProvider" ADD CONSTRAINT "TelegramProvider_wallet_address_app_id_fkey" FOREIGN KEY ("wallet_address", "app_id") REFERENCES "User"("wallet_address", "app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProviders" ADD CONSTRAINT "EventProviders_provider_name_app_id_fkey" FOREIGN KEY ("provider_name", "app_id") REFERENCES "Provider"("name", "app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProviders" ADD CONSTRAINT "EventProviders_event_name_app_id_fkey" FOREIGN KEY ("event_name", "app_id") REFERENCES "Event"("name", "app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

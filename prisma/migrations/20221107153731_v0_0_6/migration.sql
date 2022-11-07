/*
  Warnings:

  - The values [pegion] on the enum `ProviderKey` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProviderKey_new" AS ENUM ('firebase', 'pegion_web', 'pegion_mobile', 'telegram', 'slack');
ALTER TABLE "Provider" ALTER COLUMN "provider_key" TYPE "ProviderKey_new" USING ("provider_key"::text::"ProviderKey_new");
ALTER TYPE "ProviderKey" RENAME TO "ProviderKey_old";
ALTER TYPE "ProviderKey_new" RENAME TO "ProviderKey";
DROP TYPE "ProviderKey_old";
COMMIT;

-- CreateTable
CREATE TABLE "InAppWebNotifications" (
    "id" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "user_wallet_address" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,

    CONSTRAINT "InAppWebNotifications_pkey" PRIMARY KEY ("id")
);

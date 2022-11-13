/*
  Warnings:

  - The values [pigeon_web,pigeon_mobile] on the enum `ProviderKey` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "Channel" ADD VALUE 'mail';

-- AlterEnum
BEGIN;
CREATE TYPE "ProviderKey_new" AS ENUM ('sendgrid_mail', 'firebase', 'pigeon', 'telegram', 'slack');
ALTER TABLE "Provider" ALTER COLUMN "provider_key" TYPE "ProviderKey_new" USING ("provider_key"::text::"ProviderKey_new");
ALTER TABLE "NotificationLogs" ALTER COLUMN "providerType" TYPE "ProviderKey_new" USING ("providerType"::text::"ProviderKey_new");
ALTER TYPE "ProviderKey" RENAME TO "ProviderKey_old";
ALTER TYPE "ProviderKey_new" RENAME TO "ProviderKey";
DROP TYPE "ProviderKey_old";
COMMIT;

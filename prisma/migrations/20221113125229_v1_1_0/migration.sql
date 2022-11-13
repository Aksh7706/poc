/*
  Warnings:

  - You are about to drop the column `appName` on the `InAppWebNotifications` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `InAppWebNotifications` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `NotificationLogs` table. All the data in the column will be lost.
  - Added the required column `app_id` to the `InAppWebNotifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_read` to the `InAppWebNotifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_address` to the `NotificationLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerType` to the `NotificationLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InAppWebNotifications" DROP COLUMN "appName",
DROP COLUMN "isRead",
ADD COLUMN     "app_id" TEXT NOT NULL,
ADD COLUMN     "is_read" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "NotificationLogs" DROP COLUMN "provider",
ADD COLUMN     "owner_address" TEXT NOT NULL,
ADD COLUMN     "providerType" "ProviderKey" NOT NULL;

-- AddForeignKey
ALTER TABLE "InAppWebNotifications" ADD CONSTRAINT "InAppWebNotifications_app_id_user_wallet_address_fkey" FOREIGN KEY ("app_id", "user_wallet_address") REFERENCES "User"("app_id", "wallet_address") ON DELETE CASCADE ON UPDATE CASCADE;

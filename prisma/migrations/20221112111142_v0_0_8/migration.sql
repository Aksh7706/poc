/*
  Warnings:

  - The primary key for the `InAppWebNotifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InAppWebNotifications` table. All the data in the column will be lost.
  - The required column `requestId` was added to the `InAppWebNotifications` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('delivered', 'read', 'failed');

-- AlterTable
ALTER TABLE "InAppWebNotifications" DROP CONSTRAINT "InAppWebNotifications_pkey",
DROP COLUMN "id",
ADD COLUMN     "requestId" TEXT NOT NULL,
ADD CONSTRAINT "InAppWebNotifications_pkey" PRIMARY KEY ("requestId");

-- CreateTable
CREATE TABLE "NotificationLogs" (
    "requestId" TEXT NOT NULL,
    "app_name" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "provider_name" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "provider" "ProviderKey" NOT NULL,
    "user_wallet_address" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL,

    CONSTRAINT "NotificationLogs_pkey" PRIMARY KEY ("requestId")
);

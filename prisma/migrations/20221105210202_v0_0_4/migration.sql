/*
  Warnings:

  - You are about to drop the column `provider_id` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_provider_id_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "provider_id",
ADD COLUMN     "connected_providers" TEXT[];

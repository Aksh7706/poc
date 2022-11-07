/*
  Warnings:

  - You are about to drop the column `connected_providers` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "connected_providers";

-- CreateTable
CREATE TABLE "EventProviders" (
    "appName" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "providerName" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EventProviders_appName_eventName_providerName_key" ON "EventProviders"("appName", "eventName", "providerName");

-- AddForeignKey
ALTER TABLE "EventProviders" ADD CONSTRAINT "EventProviders_providerName_appName_fkey" FOREIGN KEY ("providerName", "appName") REFERENCES "Provider"("name", "app_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProviders" ADD CONSTRAINT "EventProviders_eventName_appName_fkey" FOREIGN KEY ("eventName", "appName") REFERENCES "Event"("name", "app_name") ON DELETE CASCADE ON UPDATE CASCADE;

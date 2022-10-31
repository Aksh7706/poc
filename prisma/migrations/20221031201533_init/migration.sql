-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('push', 'in_app', 'other');

-- CreateEnum
CREATE TYPE "ProviderKey" AS ENUM ('firebase', 'pegion', 'telegram', 'slack');

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "telegram_chat_id" TEXT,
    "fcm_token" TEXT[],
    "metadata" JSONB,
    "app_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "metadata" JSONB,
    "provider_id" TEXT,
    "app_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "channel" "Channel" NOT NULL,
    "provider_key" "ProviderKey" NOT NULL,
    "status_callback" TEXT,
    "app_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_name_key" ON "App"("name");

-- CreateIndex
CREATE INDEX "App_name_idx" ON "App"("name");

-- CreateIndex
CREATE INDEX "User_wallet_address_app_name_idx" ON "User"("wallet_address", "app_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_address_app_name_key" ON "User"("wallet_address", "app_name");

-- CreateIndex
CREATE INDEX "Event_name_app_name_idx" ON "Event"("name", "app_name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_app_name_key" ON "Event"("name", "app_name");

-- CreateIndex
CREATE INDEX "Provider_name_app_name_idx" ON "Provider"("name", "app_name");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_app_name_key" ON "Provider"("name", "app_name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_app_name_fkey" FOREIGN KEY ("app_name") REFERENCES "App"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_app_name_fkey" FOREIGN KEY ("app_name") REFERENCES "App"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_app_name_fkey" FOREIGN KEY ("app_name") REFERENCES "App"("name") ON DELETE CASCADE ON UPDATE CASCADE;

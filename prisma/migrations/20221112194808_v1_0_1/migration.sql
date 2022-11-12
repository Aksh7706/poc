/*
  Warnings:

  - You are about to drop the column `account_address` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_address]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_address` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_owner_address_fkey";

-- DropIndex
DROP INDEX "Account_account_address_idx";

-- DropIndex
DROP INDEX "Account_account_address_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "account_address",
ADD COLUMN     "owner_address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_owner_address_key" ON "Account"("owner_address");

-- CreateIndex
CREATE INDEX "Account_owner_address_idx" ON "Account"("owner_address");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_owner_address_fkey" FOREIGN KEY ("owner_address") REFERENCES "Account"("owner_address") ON DELETE CASCADE ON UPDATE CASCADE;

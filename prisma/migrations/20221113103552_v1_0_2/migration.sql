/*
  Warnings:

  - A unique constraint covering the columns `[api_key]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_api_key_key" ON "Account"("api_key");

-- CreateIndex
CREATE INDEX "Account_api_key_idx" ON "Account"("api_key");

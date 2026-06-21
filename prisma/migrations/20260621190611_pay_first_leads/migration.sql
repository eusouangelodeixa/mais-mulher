-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('PENDING', 'PAID', 'ACTIVATED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'PENDING',
    "orderNumber" TEXT,
    "transactionId" TEXT,
    "paymentMethod" TEXT,
    "amountMt" INTEGER,
    "paidAt" TIMESTAMP(3),
    "activationToken" TEXT,
    "activationSentAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'lojou',
    "orderType" TEXT,
    "orderNumber" TEXT,
    "transactionId" TEXT,
    "status" TEXT,
    "mobileNumber" TEXT,
    "amountMt" INTEGER,
    "matchedLeadId" TEXT,
    "note" TEXT,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_activationToken_key" ON "Lead"("activationToken");

-- CreateIndex
CREATE INDEX "Lead_whatsapp_idx" ON "Lead"("whatsapp");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "WebhookEvent_receivedAt_idx" ON "WebhookEvent"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_transactionId_orderType_key" ON "WebhookEvent"("transactionId", "orderType");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

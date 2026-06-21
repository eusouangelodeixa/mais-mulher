-- Idempotência robusta do webhook: substitui o unique composto (que falha com
-- transactionId NULL) por uma dedupeKey não-nula, e adiciona processedAt para
-- permitir reprocessar eventos cuja tentativa anterior falhou.

DROP INDEX IF EXISTS "WebhookEvent_transactionId_orderType_key";

ALTER TABLE "WebhookEvent" ADD COLUMN "dedupeKey" TEXT NOT NULL;
ALTER TABLE "WebhookEvent" ADD COLUMN "processedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "WebhookEvent_dedupeKey_key" ON "WebhookEvent"("dedupeKey");

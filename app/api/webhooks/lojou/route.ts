import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  parseLojouWebhook,
  verifyWebhookSecret,
  eventDedupeKey,
  isAcceptableAmount,
} from "@/lib/lojou";
import { processApprovedSale, processNegativeOutcome } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isUniqueViolation(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}

export async function POST(req: Request) {
  // Autenticidade: preferir o header x-webhook-secret; aceitar ?token= como
  // fallback (o segredo na URL vaza em logs — ver painel admin / rotação).
  const url = new URL(req.url);
  const provided =
    req.headers.get("x-webhook-secret") ?? url.searchParams.get("token");
  if (!verifyWebhookSecret(provided)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = parseLojouWebhook(body);
  if (!parsed) {
    return Response.json(
      { ok: false, error: "payload inválido" },
      { status: 400 },
    );
  }

  const dedupeKey = eventDedupeKey(parsed);

  // Idempotência: já processado com sucesso? Ignora.
  const existing = await prisma.webhookEvent.findUnique({
    where: { dedupeKey },
  });
  if (existing?.processedAt) {
    return Response.json({ ok: true, duplicate: true });
  }

  // Registra o evento como "lock". Se uma tentativa anterior falhou
  // (processedAt nulo), reprocessa o mesmo registro.
  let eventId: string;
  if (existing) {
    eventId = existing.id;
  } else {
    try {
      const ev = await prisma.webhookEvent.create({
        data: {
          dedupeKey,
          orderType: parsed.orderType,
          orderNumber: parsed.orderNumber,
          transactionId: parsed.transactionId,
          status: parsed.status,
          mobileNumber: parsed.mobileNumber,
          amountMt: parsed.amount != null ? Math.round(parsed.amount) : null,
          payload: (body ?? {}) as Prisma.InputJsonValue,
        },
      });
      eventId = ev.id;
    } catch (e) {
      if (isUniqueViolation(e)) {
        // Corrida: outra requisição criou o mesmo evento.
        const ev = await prisma.webhookEvent.findUnique({
          where: { dedupeKey },
        });
        if (ev?.processedAt) return Response.json({ ok: true, duplicate: true });
        if (!ev) throw e;
        eventId = ev.id;
      } else {
        throw e;
      }
    }
  }

  // Processa. Em falha transitória, devolve 500 SEM marcar processedAt, para a
  // Lojou re-tentar e o evento ser reprocessado.
  let note = `evento ${parsed.outcome.toLowerCase()} sem ação`;
  let matchedLeadId: string | null = null;
  try {
    if (parsed.outcome === "APPROVED") {
      if (!isAcceptableAmount(parsed.amount)) {
        note = `valor (${parsed.amount ?? "?"}) abaixo do mínimo — venda ignorada`;
      } else {
        const r = await processApprovedSale(parsed);
        note = r.note;
        matchedLeadId = r.leadId;
      }
    } else if (parsed.outcome === "CANCELLED") {
      const r = await processNegativeOutcome(parsed, "CANCELLED");
      note = r.note;
      matchedLeadId = r.leadId;
    } else if (parsed.outcome === "REFUNDED") {
      const r = await processNegativeOutcome(parsed, "REFUNDED");
      note = r.note;
      matchedLeadId = r.leadId;
    }
  } catch (err) {
    console.error("[LOJOU webhook] erro ao processar:", err);
    return Response.json(
      { ok: false, error: "erro ao processar" },
      { status: 500 },
    );
  }

  try {
    await prisma.webhookEvent.update({
      where: { id: eventId },
      data: { note, matchedLeadId, processedAt: new Date() },
    });
  } catch (err) {
    // O efeito já ocorreu (e é idempotente); não falha a resposta.
    console.error("[LOJOU webhook] erro ao gravar resultado:", err);
  }

  return Response.json({ ok: true, outcome: parsed.outcome, note });
}

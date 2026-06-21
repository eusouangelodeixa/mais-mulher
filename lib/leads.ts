import "server-only";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { Prisma, type Lead } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeWhatsapp } from "@/lib/validation";
import { extendPaidUntil } from "@/lib/subscription";
import { sendMessage } from "@/lib/komunika";
import type { ParsedLojouWebhook } from "@/lib/lojou";

function appUrl(): string {
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
}

function newToken(): string {
  return randomBytes(24).toString("base64url");
}

/** Captura a lead (Nome + WhatsApp já normalizado) antes do checkout. */
export async function captureLead(input: {
  name: string;
  whatsapp: string;
}): Promise<Lead> {
  // Evita duplicar: reaproveita uma lead PENDING recente do mesmo número.
  const recent = await prisma.lead.findFirst({
    where: {
      whatsapp: input.whatsapp,
      status: "PENDING",
      createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    return prisma.lead.update({
      where: { id: recent.id },
      data: { name: input.name },
    });
  }
  return prisma.lead.create({
    data: { name: input.name, whatsapp: input.whatsapp, status: "PENDING" },
  });
}

/** Localiza a lead de uma venda: por transaction_id, senão pelo número. */
async function findLeadFor(parsed: ParsedLojouWebhook): Promise<Lead | null> {
  if (parsed.transactionId) {
    const byTx = await prisma.lead.findFirst({
      where: { transactionId: parsed.transactionId },
      orderBy: { createdAt: "desc" },
    });
    if (byTx) return byTx;
  }
  const normalized = parsed.mobileNumber
    ? normalizeWhatsapp(parsed.mobileNumber)
    : null;
  if (!normalized) return null;
  // Prefere a lead ainda não convertida; senão a mais recente do número.
  return (
    (await prisma.lead.findFirst({
      where: { whatsapp: normalized, status: { in: ["PENDING", "PAID"] } },
      orderBy: { createdAt: "desc" },
    })) ??
    (await prisma.lead.findFirst({
      where: { whatsapp: normalized },
      orderBy: { createdAt: "desc" },
    }))
  );
}

function activationMessage(name: string, link: string): string {
  return (
    `Olá, ${name}! 🌸 Seu pagamento foi confirmado.\n` +
    `Ative o seu acesso ao +Mulher e comece a acompanhar o seu ciclo aqui:\n${link}`
  );
}

function renewalMessage(name: string): string {
  return (
    `Olá, ${name}! 💜 Seu pagamento foi confirmado e a sua assinatura do +Mulher ` +
    `foi renovada por mais 30 dias. É só entrar no app: ${appUrl()}/login`
  );
}

/**
 * Processa uma venda APROVADA: marca a lead como paga e provisiona o acesso.
 * - Se já existe conta com o número → estende paidUntil (+30d) e avisa por WhatsApp.
 * - Senão → gera token de ativação e envia o link mágico por WhatsApp.
 * Retorna uma nota legível para o log/admin.
 */
export async function processApprovedSale(
  parsed: ParsedLojouWebhook,
): Promise<{ note: string; leadId: string }> {
  const normalized = parsed.mobileNumber
    ? normalizeWhatsapp(parsed.mobileNumber)
    : null;

  let lead = await findLeadFor(parsed);
  if (!lead) {
    // Venda sem lead correspondente (pagou sem passar pelo /comecar, ou número
    // diferente do informado). Cria uma lead para não perder a venda.
    lead = await prisma.lead.create({
      data: {
        name: parsed.customerName ?? "Cliente",
        whatsapp: normalized ?? parsed.mobileNumber ?? "desconhecido",
        email: parsed.customerEmail,
        status: "PENDING",
      },
    });
  }

  const sale = {
    orderNumber: parsed.orderNumber,
    transactionId: parsed.transactionId,
    paymentMethod: parsed.paymentMethod,
    amountMt: parsed.amount != null ? Math.round(parsed.amount) : null,
    email: parsed.customerEmail ?? lead.email,
    paidAt: new Date(),
  };

  // Já existe conta com este número? → renova a assinatura existente.
  const existingUser = normalized
    ? await prisma.user.findUnique({ where: { whatsapp: normalized } })
    : null;

  if (existingUser) {
    const newPaidUntil = extendPaidUntil(existingUser.paidUntil);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: existingUser.id },
        data: { paidUntil: newPaidUntil },
      }),
      prisma.lead.update({
        where: { id: lead.id },
        data: {
          ...sale,
          status: "ACTIVATED",
          userId: existingUser.id,
          activatedAt: new Date(),
        },
      }),
    ]);
    await sendMessage(
      existingUser.whatsapp,
      renewalMessage(existingUser.name),
      `lojou-renew-${parsed.transactionId ?? lead.id}`,
    );
    return { note: "conta existente renovada (+30 dias) e avisada", leadId: lead.id };
  }

  // Nova lead → gera token de ativação e envia o link mágico.
  const token = lead.activationToken ?? newToken();
  await prisma.lead.update({
    where: { id: lead.id },
    data: { ...sale, status: "PAID", activationToken: token },
  });

  if (!normalized) {
    return {
      note: "venda aprovada, mas sem número válido para enviar o acesso",
      leadId: lead.id,
    };
  }

  const sent = await sendMessage(
    normalized,
    activationMessage(lead.name, `${appUrl()}/ativar?token=${token}`),
    `lojou-activate-${parsed.transactionId ?? lead.id}`,
  );
  // Só marca como enviado se o Komunika confirmou — senão fica para reenvio.
  if (sent.ok) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { activationSentAt: new Date() },
    });
  }
  return {
    note: sent.ok
      ? "acesso (link de ativação) enviado por WhatsApp"
      : "venda aprovada, mas falha ao enviar o WhatsApp (reenviar pelo admin)",
    leadId: lead.id,
  };
}

/** Processa cancelamento/reembolso: atualiza a lead e revoga acesso em reembolso. */
export async function processNegativeOutcome(
  parsed: ParsedLojouWebhook,
  outcome: "CANCELLED" | "REFUNDED",
): Promise<{ note: string; leadId: string | null }> {
  const lead = await findLeadFor(parsed);
  if (!lead) return { note: "evento sem lead correspondente", leadId: null };

  if (outcome === "CANCELLED") {
    // Invalida o token: um link de ativação ainda não usado deixa de valer.
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "CANCELLED", activationToken: null },
    });
    return { note: "lead marcada como cancelada", leadId: lead.id };
  }

  // REFUNDED → revoga acesso do usuário (se houver), invalida o token e marca a lead.
  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "REFUNDED", activationToken: null },
  });
  if (lead.userId) {
    await prisma.user.update({
      where: { id: lead.userId },
      data: { paidUntil: new Date() }, // expira imediatamente
    });
    return { note: "reembolso: acesso do usuário revogado", leadId: lead.id };
  }
  return { note: "lead marcada como reembolsada", leadId: lead.id };
}

/** Lead correspondente a um token de ativação (para a página /ativar). */
export async function getActivationLead(token: string): Promise<Lead | null> {
  if (!token) return null;
  return prisma.lead.findUnique({ where: { activationToken: token } });
}

/**
 * Ativa o acesso: cria (ou atualiza) a conta a partir da lead paga e devolve o
 * userId para iniciar a sessão. A conta nasce com paidUntil = +30 dias.
 */
export async function activateLeadAccount(
  token: string,
  password: string,
): Promise<
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "used" }
> {
  const lead = await prisma.lead.findUnique({
    where: { activationToken: token },
  });
  if (!lead) return { ok: false, reason: "invalid" };
  if (lead.activatedAt && lead.userId) return { ok: false, reason: "used" };
  // Reembolso/cancelamento invalidam a ativação.
  if (lead.status === "REFUNDED" || lead.status === "CANCELLED") {
    return { ok: false, reason: "invalid" };
  }

  // O número precisa ser válido para virar conta (User.whatsapp é @unique/normalizado).
  const whatsapp = normalizeWhatsapp(lead.whatsapp);
  if (!whatsapp) return { ok: false, reason: "invalid" };

  const existing = await prisma.user.findUnique({ where: { whatsapp } });
  // Conta já verificada: um link de ativação NÃO pode resetar a senha — faça login.
  if (existing?.whatsappVerified) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "ACTIVATED", userId: existing.id, activatedAt: new Date() },
    });
    return { ok: false, reason: "used" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    if (existing) {
      // Cadastro incompleto (não verificado): assume a conta e marca como paga.
      await prisma.$transaction([
        prisma.user.update({
          where: { id: existing.id },
          data: {
            name: lead.name,
            passwordHash,
            whatsappVerified: true,
            consentAt: existing.consentAt ?? new Date(),
            paidUntil: extendPaidUntil(existing.paidUntil),
          },
        }),
        prisma.lead.update({
          where: { id: lead.id },
          data: { status: "ACTIVATED", userId: existing.id, activatedAt: new Date() },
        }),
      ]);
      return { ok: true, userId: existing.id };
    }

    const userId = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: lead.name,
          whatsapp,
          passwordHash,
          whatsappVerified: true,
          consentAt: new Date(),
          paidUntil: extendPaidUntil(null),
        },
      });
      await tx.lead.update({
        where: { id: lead.id },
        data: { status: "ACTIVATED", userId: user.id, activatedAt: new Date() },
      });
      return user.id;
    });
    return { ok: true, userId };
  } catch (e) {
    // Corrida: conta com este número criada em paralelo → tratar como já ativada.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, reason: "used" };
    }
    throw e;
  }
}

/** Reenvia o link de ativação por WhatsApp (usado pelo painel admin). */
export async function resendActivation(
  leadId: string,
): Promise<{ ok: boolean; note: string }> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, note: "lead não encontrada" };
  if (lead.status === "ACTIVATED")
    return { ok: false, note: "lead já ativada" };
  if (lead.status === "REFUNDED" || lead.status === "CANCELLED")
    return { ok: false, note: "venda cancelada/reembolsada" };

  const normalized = normalizeWhatsapp(lead.whatsapp);
  if (!normalized) return { ok: false, note: "número inválido" };

  const token = lead.activationToken ?? newToken();
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      activationToken: token,
      status: lead.status === "PENDING" ? "PAID" : lead.status,
    },
  });
  const sent = await sendMessage(
    normalized,
    activationMessage(lead.name, `${appUrl()}/ativar?token=${token}`),
    `lojou-resend-${lead.id}-${Date.now()}`,
  );
  if (sent.ok) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { activationSentAt: new Date() },
    });
  }
  return {
    ok: sent.ok,
    note: sent.ok ? "link de ativação reenviado" : "falha ao enviar WhatsApp",
  };
}

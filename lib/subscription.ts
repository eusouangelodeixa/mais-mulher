// Estado de assinatura e regras de "modo limitado".

export type SubState = "TRIAL" | "ACTIVE" | "EXPIRED";

export interface SubInput {
  trialEndsAt: Date | null;
  paidUntil: Date | null;
}

/**
 * Estado da assinatura:
 * - ACTIVE: pagamento em dia (paidUntil no futuro);
 * - TRIAL: dentro dos 7 dias de teste (e ainda não pago);
 * - EXPIRED: nenhum dos dois.
 */
export function getSubscriptionState(u: SubInput, now: Date = new Date()): SubState {
  if (u.paidUntil && u.paidUntil.getTime() > now.getTime()) return "ACTIVE";
  if (u.trialEndsAt && u.trialEndsAt.getTime() > now.getTime()) return "TRIAL";
  return "EXPIRED";
}

/** Assinatura ativa = TRIAL ou ACTIVE (recebe previsões e lembretes). */
export function isActive(state: SubState): boolean {
  return state !== "EXPIRED";
}

/** Dias inteiros restantes até o fim do período atual (trial ou pago). */
export function daysRemaining(u: SubInput, now: Date = new Date()): number {
  const ref = u.paidUntil && u.paidUntil > now ? u.paidUntil : u.trialEndsAt;
  if (!ref) return 0;
  const ms = ref.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

/**
 * Novo `paidUntil` ao confirmar um pagamento: estende 30 dias a partir do
 * maior valor entre "agora" e o paidUntil atual (não perde dias já pagos).
 */
export function extendPaidUntil(current: Date | null, now: Date = new Date()): Date {
  const base = current && current.getTime() > now.getTime() ? current : now;
  return new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);
}

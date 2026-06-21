// Adaptador da Lojou — fluxo "pay-first" com checkout HOSPEDADO.
//
// A lead preenche Nome + WhatsApp em /comecar (vira um Lead PENDING) e é
// redirecionada para o link de checkout hospedado da Lojou (LOJOU_CHECKOUT_URL,
// ex.: https://pay.lojou.app/p/NvssZ). Após o pagamento, a Lojou chama o nosso
// webhook (/api/webhooks/lojou) com um payload no formato abaixo.
//
// Como o link de checkout é fixo (igual para todas as leads), o vínculo
// lead↔venda é feito pelo customer.mobile_number normalizado.
//
// A Lojou não assina o payload, então a autenticidade do webhook é garantida por
// um token-segredo na URL (LOJOU_WEBHOOK_SECRET), exibido no painel /admin.

import { createHash, timingSafeEqual } from "node:crypto";

export interface LojouCustomer {
  name?: string;
  email?: string;
  mobile_number?: string;
}

export interface LojouWebhookPayload {
  order_type?: string; // order_approved | order_cancelled | order_refund
  order_number?: string;
  status?: string; // approved | cancelled | refund
  transaction_id?: string;
  currency?: string;
  payment_method?: string; // mpesa | emola
  amount?: number;
  customer?: LojouCustomer;
  product?: { name?: string; price?: number; pid?: string };
  brand?: string;
  [key: string]: unknown;
}

export type LojouOutcome = "APPROVED" | "CANCELLED" | "REFUNDED" | "UNKNOWN";

export interface ParsedLojouWebhook {
  orderType: string | null;
  orderNumber: string | null;
  transactionId: string | null;
  status: string | null;
  paymentMethod: string | null;
  amount: number | null;
  customerName: string | null;
  customerEmail: string | null;
  mobileNumber: string | null; // valor bruto do payload (ex.: "+258841234567")
  outcome: LojouOutcome;
}

const DEFAULT_CHECKOUT_URL = "https://pay.lojou.app/p/NvssZ";

/**
 * Link de checkout hospedado da Lojou (igual para todas as leads).
 * Só usa LOJOU_CHECKOUT_URL se for uma URL http(s) absoluta — assim uma env
 * vazia/ausente/relativa (comum num deploy mal configurado) nunca faz o
 * redirect cair de volta na própria página.
 */
export function lojouCheckoutUrl(): string {
  const u = process.env.LOJOU_CHECKOUT_URL?.trim();
  return u && /^https?:\/\//i.test(u) ? u : DEFAULT_CHECKOUT_URL;
}

/** Verifica o token-segredo do webhook em tempo constante (fail-closed). */
export function verifyWebhookSecret(provided: string | null): boolean {
  const expected = process.env.LOJOU_WEBHOOK_SECRET;
  if (!expected || !provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** Valor mínimo (MT) para uma venda ser considerada válida (anti-forja). */
export function minAcceptableAmount(): number {
  const n = Number(process.env.LOJOU_MIN_AMOUNT_MT);
  return Number.isFinite(n) && n > 0 ? n : 47;
}

/**
 * O payload do webhook é entrada NÃO confiável. Só provisionamos acesso se o
 * valor pago for plausível (>= mínimo configurado) — bloqueia eventos forjados
 * com amount 0/ausente caso o segredo do webhook vaze.
 */
export function isAcceptableAmount(amount: number | null): boolean {
  return amount != null && Math.round(amount) >= minAcceptableAmount();
}

/**
 * Chave de deduplicação NÃO-NULA do evento (idempotência). Usa o transaction_id
 * quando presente; senão deriva do pedido/tipo/status (NULL não serve de unique
 * no Postgres).
 */
export function eventDedupeKey(p: ParsedLojouWebhook): string {
  if (p.transactionId) return `txn:${p.transactionId}`;
  if (p.orderNumber)
    return `ord:${p.orderNumber}:${p.orderType ?? ""}:${p.status ?? ""}`;
  return `evt:${p.orderType ?? ""}:${p.status ?? ""}:${p.mobileNumber ?? ""}:${p.amount ?? ""}`;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) && v !== null && v !== "" ? n : null;
}

function classify(orderType: string | null, status: string | null): LojouOutcome {
  const t = (orderType ?? "").toLowerCase();
  const s = (status ?? "").toLowerCase();
  if (t.includes("approv") || s === "approved") return "APPROVED";
  if (t.includes("refund") || s.startsWith("refund")) return "REFUNDED";
  if (t.includes("cancel") || s.startsWith("cancel")) return "CANCELLED";
  return "UNKNOWN";
}

/** Lê o payload do webhook de forma defensiva. Retorna null se irreconhecível. */
export function parseLojouWebhook(body: unknown): ParsedLojouWebhook | null {
  if (!body || typeof body !== "object") return null;
  const b = body as LojouWebhookPayload;
  const customer = (b.customer ?? {}) as LojouCustomer;

  const orderNumber = str(b.order_number);
  const transactionId = str(b.transaction_id);
  // Precisa de pelo menos um identificador de pedido.
  if (!orderNumber && !transactionId) return null;

  const orderType = str(b.order_type);
  const status = str(b.status);

  return {
    orderType,
    orderNumber,
    transactionId,
    status,
    paymentMethod: str(b.payment_method),
    amount: num(b.amount),
    customerName: str(customer.name),
    customerEmail: str(customer.email),
    mobileNumber: str(customer.mobile_number),
    outcome: classify(orderType, status),
  };
}

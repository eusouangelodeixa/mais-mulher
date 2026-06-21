// Adaptador da Lojou (pagamentos M-Pesa / E-mola).
// Doc: base https://api.lojou.app, prefixo /v1, Authorization: Bearer <API_KEY> (com escopo orders.write)
// Fluxo: POST /v1/orders → usar `checkout_url` para redirecionar →
//        confirmar com GET /v1/orders/{id} (status: approved|pending|cancelled|refunded).
//
// Em modo mock (LOJOU_MOCK=true ou sem credenciais), o pedido é auto-aprovado
// (sem checkout real), permitindo testar trial→pago→expirado sem credenciais.

export type LojouOrderStatus =
  | "approved"
  | "pending"
  | "cancelled"
  | "refunded"
  | "unknown";

export interface InitiatePaymentArgs {
  userId: string;
  phone: string;
  method: "MPESA" | "EMOLA";
  amountMt: number;
  /** referência interna (ex: id do Payment) para idempotência/rastreio. */
  reference: string;
}

export interface InitiatePaymentResult {
  ok: boolean;
  ref: string; // id do pedido na Lojou
  status: "PENDING" | "CONFIRMED" | "FAILED";
  checkoutUrl?: string;
}

function isMock(): boolean {
  return process.env.LOJOU_MOCK === "true" || !process.env.LOJOU_API_KEY;
}

function baseUrl(): string {
  return process.env.LOJOU_BASE_URL ?? "https://api.lojou.app";
}

function appUrl(): string {
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
}

/** Mapeia o status da Lojou para o status interno do Payment. */
export function mapStatus(s: LojouOrderStatus): "CONFIRMED" | "PENDING" | "FAILED" {
  if (s === "approved") return "CONFIRMED";
  if (s === "pending") return "PENDING";
  return "FAILED"; // cancelled | refunded | unknown
}

/** Cria o pedido de pagamento. Em mock, já volta CONFIRMED. */
export async function initiatePayment(
  a: InitiatePaymentArgs,
): Promise<InitiatePaymentResult> {
  if (isMock()) {
    const ref = `mock_pay_${a.reference}`;
    console.log(
      `[LOJOU MOCK] pedido ${a.method} ${a.amountMt} MT (${a.phone}) → ${ref} (auto-aprovado)`,
    );
    return { ok: true, ref, status: "CONFIRMED" };
  }

  try {
    const res = await fetch(`${baseUrl()}/v1/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LOJOU_API_KEY}`,
        "Content-Type": "application/json",
      },
      // TODO: confirmar os nomes exatos dos campos no painel/OpenAPI da Lojou.
      body: JSON.stringify({
        product_id: process.env.LOJOU_PRODUCT_ID,
        amount: a.amountMt,
        currency: "MZN",
        payment_method: a.method.toLowerCase(), // "mpesa" | "emola"
        customer: { phone: a.phone.replace(/\D/g, "") },
        metadata: { userId: a.userId, reference: a.reference },
        success_url: `${appUrl()}/assinatura?retorno=sucesso`,
        cancel_url: `${appUrl()}/assinatura?retorno=cancelado`,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[LOJOU] erro ${res.status}: ${text}`);
      return { ok: false, ref: "", status: "FAILED" };
    }

    const json = (await res.json().catch(() => null)) as
      | { data?: { id?: string; checkout_url?: string; status?: LojouOrderStatus } }
      | null;
    const data = json?.data ?? {};
    return {
      ok: true,
      ref: data.id ?? "",
      status: mapStatus(data.status ?? "pending"),
      checkoutUrl: data.checkout_url,
    };
  } catch (err) {
    console.error("[LOJOU] falha de rede:", err);
    return { ok: false, ref: "", status: "FAILED" };
  }
}

/** Consulta o status autoritativo de um pedido. Em mock, volta "approved". */
export async function getOrderStatus(ref: string): Promise<LojouOrderStatus> {
  if (isMock()) return "approved";

  try {
    const res = await fetch(`${baseUrl()}/v1/orders/${encodeURIComponent(ref)}`, {
      headers: { Authorization: `Bearer ${process.env.LOJOU_API_KEY}` },
    });
    if (!res.ok) return "unknown";
    const json = (await res.json().catch(() => null)) as
      | { data?: { status?: LojouOrderStatus } }
      | null;
    return json?.data?.status ?? "unknown";
  } catch (err) {
    console.error("[LOJOU] falha ao consultar pedido:", err);
    return "unknown";
  }
}

/**
 * Extrai defensivamente o id do pedido de um payload de webhook.
 * O formato exato não está documentado, então procuramos os campos mais prováveis.
 */
export function parseWebhook(body: unknown): { ref: string } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const data = (b.data ?? b.order ?? b) as Record<string, unknown>;
  const ref =
    (data.id as string | undefined) ??
    (data.order_id as string | undefined) ??
    (b.id as string | undefined) ??
    (b.order_id as string | undefined);
  return ref ? { ref } : null;
}

// Adaptador do Komunika (WhatsApp).
// Doc: POST https://api.komunika.site/api/v1/messages/send
//   headers: Authorization: Bearer <API_KEY>, X-Idempotency-Key (opcional)
//   body: { instanceId, to: "258840000000", type: "text", content }
//   resposta 201: { status: "success", data: { id, ... } }
//
// Em modo mock (KOMUNIKA_MOCK=true ou sem credenciais), a mensagem é apenas
// impressa no console do servidor — o app roda de ponta a ponta sem credenciais.

interface SendResult {
  ok: boolean;
  id?: string;
}

function isMock(): boolean {
  return (
    process.env.KOMUNIKA_MOCK === "true" ||
    !process.env.KOMUNIKA_API_KEY ||
    !process.env.KOMUNIKA_INSTANCE_ID
  );
}

/** Komunika espera apenas dígitos com código do país, ex: 258840000000. */
function toDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

async function send(
  to: string,
  content: string,
  idempotencyKey?: string,
): Promise<SendResult> {
  const digits = toDigits(to);

  if (isMock()) {
    console.log(
      `\n[KOMUNIKA MOCK] → ${digits}\n  ${content.replace(/\n/g, "\n  ")}\n`,
    );
    return { ok: true, id: `mock_${idempotencyKey ?? digits}` };
  }

  try {
    const res = await fetch(
      `${process.env.KOMUNIKA_BASE_URL}/api/v1/messages/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KOMUNIKA_API_KEY}`,
          "Content-Type": "application/json",
          ...(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : {}),
        },
        body: JSON.stringify({
          instanceId: process.env.KOMUNIKA_INSTANCE_ID,
          to: digits,
          type: "text",
          content,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[KOMUNIKA] erro ${res.status}: ${text}`);
      return { ok: false };
    }

    const json = (await res.json().catch(() => null)) as
      | { data?: { id?: string } }
      | null;
    console.log(`[KOMUNIKA] enviado para ${digits} (id ${json?.data?.id ?? "?"})`);
    return { ok: true, id: json?.data?.id };
  } catch (err) {
    console.error("[KOMUNIKA] falha de rede:", err);
    return { ok: false };
  }
}

/** Envia o código de verificação (OTP) de 4 dígitos. */
export function sendOtp(to: string, code: string): Promise<SendResult> {
  return send(
    to,
    `+Mulher: seu código de verificação é ${code}. Válido por 10 minutos.`,
  );
}

/** Envia uma mensagem de texto livre (lembretes). */
export function sendMessage(
  to: string,
  content: string,
  idempotencyKey?: string,
): Promise<SendResult> {
  return send(to, content, idempotencyKey);
}

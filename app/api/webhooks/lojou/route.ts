import { prisma } from "@/lib/prisma";
import { parseWebhook, getOrderStatus, mapStatus } from "@/lib/lojou";
import { confirmPayment } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = parseWebhook(body);
  if (!parsed)
    return Response.json(
      { ok: false, error: "payload inválido" },
      { status: 400 },
    );
  const payment = await prisma.payment.findUnique({
    where: { lojouRef: parsed.ref },
  });
  if (!payment)
    return Response.json(
      { ok: false, error: "pedido desconhecido" },
      { status: 404 },
    );
  if (payment.status === "CONFIRMED")
    return Response.json({ ok: true, already: true });
  const status = await getOrderStatus(parsed.ref);
  const mapped = mapStatus(status);
  if (mapped === "CONFIRMED") {
    await confirmPayment(payment.id);
  } else if (mapped === "FAILED") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
  }
  return Response.json({ ok: true, status: mapped });
}

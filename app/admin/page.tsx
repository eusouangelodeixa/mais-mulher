import { LogOut, Webhook, Users, BadgeCheck, Wallet, Send } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import type { LeadStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { CopyField } from "@/components/admin/CopyField";
import { resendAccessAction, adminLogout } from "./actions";

export const dynamic = "force-dynamic";

function fmt(d: Date | null): string {
  if (!d) return "—";
  return formatInTimeZone(d, "Africa/Maputo", "dd/MM HH:mm", { locale: ptBR });
}

const STATUS_STYLE: Record<LeadStatus, { label: string; cls: string }> = {
  PENDING: { label: "Aguardando", cls: "bg-secondary text-muted-foreground" },
  PAID: { label: "Pago", cls: "bg-primary/15 text-rose-soft" },
  ACTIVATED: { label: "Ativada", cls: "bg-rose/15 text-rose" },
  CANCELLED: { label: "Cancelada", cls: "bg-secondary text-muted-foreground" },
  REFUNDED: { label: "Reembolsada", cls: "bg-secondary text-muted-foreground" },
};

export default async function AdminPage() {
  await requireAdmin();

  const [leads, events, grouped, revenue] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
    prisma.webhookEvent.findMany({ orderBy: { receivedAt: "desc" }, take: 30 }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.aggregate({
      _sum: { amountMt: true },
      where: { status: { in: ["PAID", "ACTIVATED"] } },
    }),
  ]);

  const count = (s: LeadStatus) =>
    grouped.find((g) => g.status === s)?._count._all ?? 0;
  const totalLeads = grouped.reduce((sum, g) => sum + g._count._all, 0);
  const paid = count("PAID") + count("ACTIVATED");
  const activated = count("ACTIVATED");
  const revenueMt = revenue._sum.amountMt ?? 0;

  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const secret = process.env.LOJOU_WEBHOOK_SECRET ?? "";
  const webhookUrl = `${base}/api/webhooks/lojou?token=${secret}`;

  const stats = [
    { label: "Leads", value: totalLeads, icon: Users },
    { label: "Pagamentos", value: paid, icon: BadgeCheck },
    { label: "Contas ativadas", value: activated, icon: Send },
    { label: "Receita (MT)", value: revenueMt, icon: Wallet },
  ];

  return (
    <div className="landing min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              · Painel admin
            </span>
          </div>
          <form action={adminLogout}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut /> Sair
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-8">
        {/* Webhook */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Webhook className="size-5 text-rose" />
            <h2 className="font-display text-lg font-semibold">
              URL do webhook da Lojou
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Registre esta URL no painel da Lojou (eventos de pedido). Ela já
            inclui o token-segredo que autentica as chamadas — trate como senha.
          </p>
          <div className="mt-4">
            {secret ? (
              <CopyField value={webhookUrl} secret />
            ) : (
              <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-rose-soft">
                Defina <code className="font-mono">LOJOU_WEBHOOK_SECRET</code> no
                ambiente para gerar a URL do webhook.
              </p>
            )}
          </div>
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            <li>• Eventos esperados: order_approved, order_cancelled, order_refund.</li>
            <li>• Em order_approved, o acesso é enviado automaticamente pelo WhatsApp.</li>
            <li>
              • Mais seguro: se a Lojou permitir, envie o segredo no header{" "}
              <code className="font-mono">x-webhook-secret</code> em vez do{" "}
              <code className="font-mono">?token=</code> (que aparece em logs).
            </li>
            <li>
              • Suspeitou de vazamento? Troque{" "}
              <code className="font-mono">LOJOU_WEBHOOK_SECRET</code> e atualize
              aqui e na Lojou.
            </li>
            <li>• Checkout configurado: {process.env.LOJOU_CHECKOUT_URL ?? "—"}</li>
          </ul>
        </section>

        {/* Estatísticas */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <s.icon className="size-5 text-rose" />
              <p className="font-display mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Leads */}
        <section className="rounded-2xl border border-border bg-card">
          <h2 className="font-display border-b border-border px-6 py-4 text-lg font-semibold">
            Leads e vendas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">WhatsApp</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Valor</th>
                  <th className="px-6 py-3 font-medium">Capturada</th>
                  <th className="px-6 py-3 font-medium">Pago em</th>
                  <th className="px-6 py-3 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Nenhuma lead ainda.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const st = STATUS_STYLE[lead.status];
                    return (
                      <tr
                        key={lead.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="px-6 py-3 font-medium">{lead.name}</td>
                        <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                          {lead.whatsapp}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {lead.amountMt != null ? `${lead.amountMt} MT` : "—"}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {fmt(lead.createdAt)}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {fmt(lead.paidAt)}
                        </td>
                        <td className="px-6 py-3">
                          {lead.status === "PAID" ? (
                            <form action={resendAccessAction}>
                              <input
                                type="hidden"
                                name="leadId"
                                value={lead.id}
                              />
                              <Button type="submit" variant="outline" size="sm">
                                <Send /> Reenviar acesso
                              </Button>
                            </form>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Eventos do webhook */}
        <section className="rounded-2xl border border-border bg-card">
          <h2 className="font-display border-b border-border px-6 py-4 text-lg font-semibold">
            Eventos do webhook
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-6 py-3 font-medium">Recebido</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Transação</th>
                  <th className="px-6 py-3 font-medium">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Nenhum evento recebido ainda.
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => (
                    <tr
                      key={ev.id}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-6 py-3 text-muted-foreground">
                        {fmt(ev.receivedAt)}
                      </td>
                      <td className="px-6 py-3">{ev.orderType ?? "—"}</td>
                      <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                        {ev.transactionId ?? ev.orderNumber ?? "—"}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {ev.note ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

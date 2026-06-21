import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSubscriptionState, daysRemaining } from "@/lib/subscription";
import { formatShort } from "@/lib/format";
import { lojouCheckoutUrl } from "@/lib/lojou";
import { Card, Banner, primaryBtn } from "@/components/ui";

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ retorno?: string }>;
}) {
  const user = await requireUser();
  const { retorno } = await searchParams;
  const state = getSubscriptionState(user);
  const dias = daysRemaining(user);
  const checkout = lojouCheckoutUrl();
  const ctaLabel = state === "ACTIVE" ? "Renovar assinatura" : "Assinar agora";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Assinatura</h1>

      {retorno === "sucesso" ? (
        <Banner tone="info">
          Pagamento recebido! Assim que confirmado, você recebe o acesso no
          WhatsApp.
        </Banner>
      ) : null}
      {retorno === "cancelado" ? (
        <Banner tone="warning">Pagamento cancelado.</Banner>
      ) : null}

      <Card>
        <p className="text-lg font-bold text-brand-700">
          Plano Único — 67 MT/mês
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          <li>• Registro ilimitado de ciclos</li>
          <li>• Histórico completo</li>
          <li>• Previsões automáticas</li>
          <li>• Lembretes via WhatsApp</li>
          <li>• Conteúdo educativo</li>
        </ul>
      </Card>

      <Card>
        {state === "TRIAL" ? (
          <p className="text-gray-700">
            Teste grátis — {dias} {dias === 1 ? "dia restante" : "dias restantes"}
            .
          </p>
        ) : null}
        {state === "ACTIVE" ? (
          <p className="text-gray-700">
            Assinatura ativa
            {user.paidUntil ? ` até ${formatShort(user.paidUntil)}` : ""}.
          </p>
        ) : null}
        {state === "EXPIRED" ? (
          <p className="text-gray-700">
            Assinatura expirada. Renove para voltar a receber previsões e
            lembretes.
          </p>
        ) : null}
      </Card>

      <Card>
        <p className="text-sm text-gray-600">
          O pagamento é feito com M-Pesa ou E-mola no checkout seguro da Lojou.
          Use o mesmo número de WhatsApp ({user.whatsapp}) para a renovação ser
          reconhecida automaticamente.
        </p>
        <a
          href={checkout}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryBtn("mt-4")}
        >
          {ctaLabel}
        </a>
      </Card>

      <p className="text-center text-xs text-gray-500">
        <Link href="/dashboard" className="font-medium text-brand-700">
          Voltar ao início
        </Link>
      </p>
    </div>
  );
}

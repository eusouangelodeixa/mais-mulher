import { requireUser } from "@/lib/auth";
import {
  getSubscriptionState,
  daysRemaining,
} from "@/lib/subscription";
import { formatShort } from "@/lib/format";
import { Card, Banner } from "@/components/ui";
import { PaymentForm } from "./PaymentForm";

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ retorno?: string }>;
}) {
  const user = await requireUser();
  const { retorno } = await searchParams;
  const state = getSubscriptionState(user);
  const dias = daysRemaining(user);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Assinatura</h1>

      {retorno === "sucesso" ? (
        <Banner tone="info">
          Pagamento recebido. Sua assinatura será atualizada em instantes.
        </Banner>
      ) : null}
      {retorno === "cancelado" ? (
        <Banner tone="warning">Pagamento cancelado.</Banner>
      ) : null}

      <Card>
        <p className="text-lg font-bold text-brand-700">
          Plano Único — 47 MT/mês
        </p>
        <ul>
          <li>Registro ilimitado de ciclos</li>
          <li>Histórico completo</li>
          <li>Previsões automáticas</li>
          <li>Lembretes via WhatsApp</li>
          <li>Conteúdo educativo</li>
        </ul>
      </Card>

      <Card>
        {state === "TRIAL" ? (
          <p>
            Teste grátis — {dias}{" "}
            {dias === 1 ? "dia restante" : "dias restantes"}.
          </p>
        ) : null}
        {state === "ACTIVE" ? (
          <p>
            Assinatura ativa
            {user.paidUntil ? ` até ${formatShort(user.paidUntil)}` : ""}.
          </p>
        ) : null}
        {state === "EXPIRED" ? (
          <p>
            Assinatura expirada. Renove para voltar a receber previsões e
            lembretes.
          </p>
        ) : null}
      </Card>

      <PaymentForm />
    </div>
  );
}

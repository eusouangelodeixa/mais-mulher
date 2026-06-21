import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSubscriptionState, isActive } from "@/lib/subscription";
import { formatShort } from "@/lib/format";
import { LimitedModeBanner } from "@/components/LimitedModeBanner";
import { Card } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { startPeriod, endPeriod } from "./actions";

export default async function RegistrarPage() {
  const user = await requireUser();
  const state = getSubscriptionState(user);

  if (!isActive(state)) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Registrar menstruação
        </h1>
        <LimitedModeBanner />
        <p className="text-gray-700">
          Renove sua assinatura para registrar e receber previsões.
        </p>
      </div>
    );
  }

  const open = await prisma.cycle.findFirst({
    where: { userId: user.id, endDate: null },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">
        Registrar menstruação
      </h1>

      {open ? (
        <Card>
          <p className="text-gray-700">
            Menstruação em curso desde {formatShort(open.startDate)}.
          </p>
          <form action={endPeriod} className="mt-4">
            <SubmitButton pendingLabel="Registrando...">
              Encerrar Menstruação
            </SubmitButton>
          </form>
        </Card>
      ) : (
        <Card>
          <p className="text-gray-700">
            Registre o início da sua menstruação para atualizar as previsões.
          </p>
          <form action={startPeriod} className="mt-4">
            <SubmitButton pendingLabel="Registrando...">
              Iniciar Menstruação
            </SubmitButton>
          </form>
        </Card>
      )}
    </div>
  );
}

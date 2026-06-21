import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayInMaputo } from "@/lib/today";
import { predictCycle } from "@/lib/cycle";
import { getSubscriptionState, daysRemaining } from "@/lib/subscription";
import { PredictionCard } from "@/components/PredictionCard";
import { LimitedModeBanner } from "@/components/LimitedModeBanner";
import { Card, Banner, primaryBtn } from "@/components/ui";

export default async function DashboardPage() {
  const user = await requireUser();
  const cycles = await prisma.cycle.findMany({
    where: { userId: user.id },
    orderBy: { startDate: "desc" },
  });
  const state = getSubscriptionState(user);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-gray-500">Olá,</p>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
      </div>

      {state === "TRIAL" && (
        <Banner tone="info">
          Teste grátis: {daysRemaining(user)}{" "}
          {daysRemaining(user) === 1 ? "dia restante" : "dias restantes"}.
        </Banner>
      )}

      {state === "EXPIRED" ? (
        <>
          <LimitedModeBanner />
          <Card>
            <Link href="/historico" className={primaryBtn()}>
              Ver histórico
            </Link>
          </Card>
        </>
      ) : (
        (() => {
          const prediction = predictCycle(
            cycles.map((c) => ({ startDate: c.startDate, endDate: c.endDate })),
            {
              lastPeriodStart: user.lastPeriodStart,
              baseCycleLength: user.baseCycleLength ?? 28,
              basePeriodLength: user.basePeriodLength ?? 5,
            },
            todayInMaputo(),
          );

          if (prediction) {
            return (
              <>
                <PredictionCard p={prediction} />
                <Link href="/registrar" className={primaryBtn()}>
                  Registrar menstruação
                </Link>
              </>
            );
          }

          return (
            <Card>
              <p className="text-gray-700">
                Complete sua configuração inicial para ver as previsões.
              </p>
              <Link href="/onboarding" className={primaryBtn("mt-4")}>
                Configurar
              </Link>
            </Card>
          );
        })()
      )}
    </div>
  );
}

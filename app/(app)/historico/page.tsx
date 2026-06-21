import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { diffInDays } from "@/lib/cycle";
import { formatShort } from "@/lib/format";
import { Card } from "@/components/ui";

export default async function HistoricoPage() {
  const user = await requireUser();
  const cycles = await prisma.cycle.findMany({
    where: { userId: user.id },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Histórico</h1>

      {cycles.length === 0 ? (
        <Card>Você ainda não registrou nenhuma menstruação.</Card>
      ) : (
        <div className="space-y-3">
          {cycles.map((cycle, i) => {
            const inicio = formatShort(cycle.startDate);
            const termino = cycle.endDate
              ? formatShort(cycle.endDate)
              : "em curso";
            const cycleDuration =
              i > 0
                ? `${diffInDays(cycles[i - 1].startDate, cycle.startDate)} dias`
                : "—";

            return (
              <Card key={cycle.id}>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Início</p>
                    <p className="font-medium">{inicio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Término</p>
                    <p className="font-medium">{termino}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duração do ciclo</p>
                    <p className="font-medium">{cycleDuration}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

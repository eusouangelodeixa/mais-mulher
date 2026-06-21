import type { CyclePrediction } from "@/lib/cycle";
import { formatDate, formatLong, daysLabel } from "@/lib/format";
import { Card } from "./ui";

export function PredictionCard({ p }: { p: CyclePrediction }) {
  return (
    <div className="space-y-4">
      {/* Destaque: próxima menstruação */}
      <Card className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <p className="text-sm/relaxed opacity-90">Próxima menstruação prevista</p>
        <p className="mt-1 text-2xl font-bold">{formatLong(p.nextPeriodDate)}</p>
        <p className="mt-2 text-sm opacity-90">
          {p.isOverdue
            ? `Atraso de ${daysLabel(-p.daysUntilNextPeriod)}`
            : p.daysUntilNextPeriod === 0
              ? "É hoje"
              : `Faltam ${daysLabel(p.daysUntilNextPeriod)}`}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-gray-500">Dia atual do ciclo</p>
          <p className="mt-1 text-xl font-bold text-brand-700">
            {p.currentCycleDay}
            <span className="text-sm font-normal text-gray-500"> / {p.averageCycleLength}</span>
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500">Situação</p>
          <p className="mt-1 text-base font-semibold text-brand-700">
            {p.isCurrentlyMenstruating ? "Menstruada 🩸" : p.isOverdue ? "Em atraso" : "No ciclo"}
          </p>
        </Card>
      </div>

      <Card>
        <p className="text-xs text-gray-500">Próxima janela fértil</p>
        <p className="mt-1 text-base font-semibold text-accent-600">
          {formatDate(p.fertileWindowStart)} a {formatDate(p.fertileWindowEnd)}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Ovulação estimada em {formatDate(p.ovulationDate)}. É uma estimativa e
          não substitui orientação médica.
        </p>
      </Card>
    </div>
  );
}

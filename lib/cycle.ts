// Lógica de previsão do ciclo menstrual — funções puras, sem I/O.
// Todas as datas são tratadas em "meia-noite UTC" para um cálculo de dias estável,
// independente de fuso horário.

export interface CycleInput {
  startDate: Date;
  endDate: Date | null;
}

export interface CycleBase {
  lastPeriodStart: Date | null; // valor do onboarding
  baseCycleLength: number; // duração típica do ciclo (dias)
  basePeriodLength: number; // duração típica da menstruação (dias)
}

export interface CyclePrediction {
  averageCycleLength: number; // dias
  lastStartDate: Date; // âncora da previsão
  nextPeriodDate: Date; // âncora + média do ciclo
  daysUntilNextPeriod: number; // pode ser negativo se atrasado
  currentCycleDay: number; // base 1: (hoje - âncora) + 1
  ovulationDate: Date; // próxima menstruação - 14
  fertileWindowStart: Date; // ovulação - 5
  fertileWindowEnd: Date; // ovulação + 1
  isCurrentlyMenstruating: boolean;
  isOverdue: boolean; // hoje > próxima menstruação prevista
}

const MIN_CYCLE = 21;
const MAX_CYCLE = 35;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Normaliza uma data para meia-noite UTC (descarta hora/fuso). */
export function toUtcMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Soma `n` dias (pode ser negativo) a uma data, em UTC. */
export function addDays(d: Date, n: number): Date {
  const base = toUtcMidnight(d);
  return new Date(base.getTime() + n * MS_PER_DAY);
}

/** Diferença em dias inteiros entre `a` e `b` (a - b). */
export function diffInDays(a: Date, b: Date): number {
  return Math.round(
    (toUtcMidnight(a).getTime() - toUtcMidnight(b).getTime()) / MS_PER_DAY,
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Duração média do ciclo (regra de negócio do PRD):
 * - menos de 2 ciclos registrados → usa o valor do onboarding;
 * - 2 ou mais ciclos → média dos intervalos entre datas de início consecutivas.
 * Resultado arredondado e limitado a [21, 35] dias por sanidade.
 */
export function computeAverageCycleLength(
  cycles: CycleInput[],
  baseCycleLength: number,
): number {
  if (cycles.length < 2) {
    return clamp(Math.round(baseCycleLength), MIN_CYCLE, MAX_CYCLE);
  }

  const sorted = [...cycles].sort(
    (a, b) => toUtcMidnight(a.startDate).getTime() - toUtcMidnight(b.startDate).getTime(),
  );

  let sum = 0;
  let count = 0;
  for (let i = 1; i < sorted.length; i++) {
    const interval = diffInDays(sorted[i].startDate, sorted[i - 1].startDate);
    if (interval > 0) {
      sum += interval;
      count += 1;
    }
  }

  if (count === 0) {
    return clamp(Math.round(baseCycleLength), MIN_CYCLE, MAX_CYCLE);
  }

  return clamp(Math.round(sum / count), MIN_CYCLE, MAX_CYCLE);
}

/**
 * Previsão completa do ciclo. Retorna `null` quando não há âncora
 * (sem ciclos registrados e sem data de onboarding).
 */
export function predictCycle(
  cycles: CycleInput[],
  base: CycleBase,
  today: Date,
): CyclePrediction | null {
  const todayUtc = toUtcMidnight(today);

  // Âncora: data de início do ciclo mais recente; senão, valor do onboarding.
  let lastStartDate: Date | null = null;
  let mostRecentCycle: CycleInput | null = null;

  if (cycles.length > 0) {
    const sorted = [...cycles].sort(
      (a, b) =>
        toUtcMidnight(b.startDate).getTime() - toUtcMidnight(a.startDate).getTime(),
    );
    mostRecentCycle = sorted[0];
    lastStartDate = toUtcMidnight(sorted[0].startDate);
  } else if (base.lastPeriodStart) {
    lastStartDate = toUtcMidnight(base.lastPeriodStart);
  }

  if (!lastStartDate) return null;

  const averageCycleLength = computeAverageCycleLength(cycles, base.baseCycleLength);
  const nextPeriodDate = addDays(lastStartDate, averageCycleLength);
  const ovulationDate = addDays(nextPeriodDate, -14);
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = addDays(ovulationDate, 1);

  const daysUntilNextPeriod = diffInDays(nextPeriodDate, todayUtc);
  const currentCycleDay = diffInDays(todayUtc, lastStartDate) + 1;
  const isOverdue = daysUntilNextPeriod < 0;

  // Menstruando agora: existe um ciclo em curso (sem data de término) e hoje
  // está dentro da janela [início, início + duração típica da menstruação).
  let isCurrentlyMenstruating = false;
  if (mostRecentCycle) {
    const start = toUtcMidnight(mostRecentCycle.startDate);
    if (mostRecentCycle.endDate === null) {
      const periodEnd = addDays(start, base.basePeriodLength);
      isCurrentlyMenstruating = todayUtc >= start && todayUtc < periodEnd;
    } else {
      const end = toUtcMidnight(mostRecentCycle.endDate);
      isCurrentlyMenstruating = todayUtc >= start && todayUtc <= end;
    }
  }

  return {
    averageCycleLength,
    lastStartDate,
    nextPeriodDate,
    daysUntilNextPeriod,
    currentCycleDay,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    isCurrentlyMenstruating,
    isOverdue,
  };
}

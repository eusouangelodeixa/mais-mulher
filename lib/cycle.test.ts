import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeAverageCycleLength,
  predictCycle,
  addDays,
  diffInDays,
  toUtcMidnight,
} from "./cycle";

const d = (s: string) => new Date(`${s}T00:00:00.000Z`);

test("diffInDays e addDays", () => {
  assert.equal(diffInDays(d("2026-06-29"), d("2026-06-01")), 28);
  assert.equal(diffInDays(d("2026-06-01"), d("2026-06-29")), -28);
  assert.deepEqual(addDays(d("2026-06-01"), 28), d("2026-06-29"));
  assert.deepEqual(addDays(d("2026-06-15"), -14), d("2026-06-01"));
});

test("toUtcMidnight descarta a hora", () => {
  assert.deepEqual(
    toUtcMidnight(new Date("2026-06-15T18:45:00.000Z")),
    d("2026-06-15"),
  );
});

test("média do ciclo: menos de 2 ciclos usa valor do onboarding", () => {
  assert.equal(computeAverageCycleLength([], 28), 28);
  assert.equal(
    computeAverageCycleLength([{ startDate: d("2026-06-01"), endDate: null }], 30),
    30,
  );
});

test("média do ciclo: 2+ ciclos usa média dos intervalos reais", () => {
  const cycles = [
    { startDate: d("2026-04-01"), endDate: d("2026-04-05") }, // intervalo 30
    { startDate: d("2026-05-01"), endDate: d("2026-05-05") }, // intervalo 27
    { startDate: d("2026-05-28"), endDate: null },
  ];
  // (30 + 27) / 2 = 28.5 -> arredonda 29
  assert.equal(computeAverageCycleLength(cycles, 28), 29);
});

test("média do ciclo é limitada a [21, 35]", () => {
  assert.equal(computeAverageCycleLength([], 10), 21);
  assert.equal(computeAverageCycleLength([], 99), 35);
});

test("exemplo do PRD: 01/06 + 28 dias = 29/06, ovulação 15/06, fértil 10-16/06", () => {
  const base = { lastPeriodStart: d("2026-06-01"), baseCycleLength: 28, basePeriodLength: 5 };
  const p = predictCycle([], base, d("2026-06-10"));
  assert.ok(p);
  assert.equal(p!.averageCycleLength, 28);
  assert.deepEqual(p!.nextPeriodDate, d("2026-06-29"));
  assert.deepEqual(p!.ovulationDate, d("2026-06-15"));
  assert.deepEqual(p!.fertileWindowStart, d("2026-06-10"));
  assert.deepEqual(p!.fertileWindowEnd, d("2026-06-16"));
  assert.equal(p!.daysUntilNextPeriod, 19);
  assert.equal(p!.currentCycleDay, 10); // 10/06 é o 10º dia desde 01/06
  assert.equal(p!.isOverdue, false);
});

test("sem âncora retorna null", () => {
  const base = { lastPeriodStart: null, baseCycleLength: 28, basePeriodLength: 5 };
  assert.equal(predictCycle([], base, d("2026-06-10")), null);
});

test("ciclo mais recente vira âncora (não o onboarding)", () => {
  const base = { lastPeriodStart: d("2026-01-01"), baseCycleLength: 28, basePeriodLength: 5 };
  const cycles = [{ startDate: d("2026-06-05"), endDate: null }];
  const p = predictCycle(cycles, base, d("2026-06-07"));
  assert.ok(p);
  assert.deepEqual(p!.lastStartDate, d("2026-06-05"));
  assert.deepEqual(p!.nextPeriodDate, d("2026-07-03"));
});

test("atraso: hoje passou da previsão sem novo registro", () => {
  const base = { lastPeriodStart: d("2026-06-01"), baseCycleLength: 28, basePeriodLength: 5 };
  const p = predictCycle([], base, d("2026-07-02")); // previsto 29/06
  assert.ok(p);
  assert.equal(p!.isOverdue, true);
  assert.equal(p!.daysUntilNextPeriod, -3);
});

test("menstruando agora: ciclo em curso dentro da duração típica", () => {
  const base = { lastPeriodStart: null, baseCycleLength: 28, basePeriodLength: 5 };
  const cycles = [{ startDate: d("2026-06-14"), endDate: null }];
  const dentro = predictCycle(cycles, base, d("2026-06-16"));
  assert.equal(dentro!.isCurrentlyMenstruating, true); // dia 3 de 5
  const fora = predictCycle(cycles, base, d("2026-06-20"));
  assert.equal(fora!.isCurrentlyMenstruating, false); // passou dos 5 dias
});

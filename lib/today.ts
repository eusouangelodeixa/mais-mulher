import { formatInTimeZone } from "date-fns-tz";

const TZ = "Africa/Maputo";

/** Dia "de hoje" no fuso de Moçambique (CAT/UTC+2), como meia-noite UTC. */
export function todayInMaputo(now: Date = new Date()): Date {
  const ymd = formatInTimeZone(now, TZ, "yyyy-MM-dd");
  return new Date(`${ymd}T00:00:00.000Z`);
}

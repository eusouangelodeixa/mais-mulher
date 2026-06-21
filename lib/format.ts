import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

// As datas vêm do Prisma (@db.Date) como meia-noite UTC. Formatamos sempre em
// UTC para não deslocar o dia conforme o fuso da máquina.

export function formatDate(d: Date, fmt = "d 'de' MMMM"): string {
  return formatInTimeZone(d, "UTC", fmt, { locale: ptBR });
}

export function formatLong(d: Date): string {
  return formatInTimeZone(d, "UTC", "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatShort(d: Date): string {
  return formatInTimeZone(d, "UTC", "dd/MM/yyyy", { locale: ptBR });
}

/** "3 dias", "1 dia", "hoje" para contagens. */
export function daysLabel(n: number): string {
  const abs = Math.abs(n);
  if (n === 0) return "hoje";
  return `${abs} ${abs === 1 ? "dia" : "dias"}`;
}

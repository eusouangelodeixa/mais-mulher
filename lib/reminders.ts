import { prisma } from "@/lib/prisma";
import { todayInMaputo } from "@/lib/today";
import { predictCycle, diffInDays } from "@/lib/cycle";
import { sendMessage } from "@/lib/komunika";
import type { ReminderKind } from "@prisma/client";

const MESSAGES = {
  THREE_DAYS_BEFORE:
    "Olá! Sua próxima menstruação está prevista para os próximos dias. Prepare-se com antecedência. 🌸",
  ONE_DAY_BEFORE: "Lembrete: sua menstruação está prevista para amanhã. 💜",
  PREDICTED_START: "Hoje é a data prevista para o início do seu ciclo menstrual.",
  FERTILE_START: "Sua janela fértil está se aproximando.",
  DELAY:
    "Sua menstruação está com alguns dias de atraso. Atrasos ocasionais são normais. Se persistir, considere falar com um profissional de saúde. 💜",
} as const;

export async function runReminders(
  now: Date
): Promise<{ processed: number; sent: number; skipped: number }> {
  const today = todayInMaputo(now);

  const users = await prisma.user.findMany({
    where: {
      whatsappVerified: true,
      onboardingDone: true,
      OR: [{ trialEndsAt: { gt: now } }, { paidUntil: { gt: now } }],
    },
    include: { cycles: true },
  });

  let processed = 0;
  let sent = 0;
  let skipped = 0;

  for (const user of users) {
    processed++;

    const p = predictCycle(
      user.cycles.map((c) => ({ startDate: c.startDate, endDate: c.endDate })),
      {
        lastPeriodStart: user.lastPeriodStart,
        baseCycleLength: user.baseCycleLength ?? 28,
        basePeriodLength: user.basePeriodLength ?? 5,
      },
      today
    );
    if (!p) continue;

    const fires: { kind: ReminderKind; forDate: Date; message: string }[] = [];

    const d = p.daysUntilNextPeriod;
    if (d === 3) {
      fires.push({
        kind: "THREE_DAYS_BEFORE",
        forDate: p.nextPeriodDate,
        message: MESSAGES.THREE_DAYS_BEFORE,
      });
    }
    if (d === 1) {
      fires.push({
        kind: "ONE_DAY_BEFORE",
        forDate: p.nextPeriodDate,
        message: MESSAGES.ONE_DAY_BEFORE,
      });
    }
    if (d === 0) {
      fires.push({
        kind: "PREDICTED_START",
        forDate: p.nextPeriodDate,
        message: MESSAGES.PREDICTED_START,
      });
    }
    if (diffInDays(today, p.fertileWindowStart) === 0) {
      fires.push({
        kind: "FERTILE_START",
        forDate: p.fertileWindowStart,
        message: MESSAGES.FERTILE_START,
      });
    }
    if (d === -3) {
      const hasNew = user.cycles.some(
        (c) => c.startDate.getTime() >= p.nextPeriodDate.getTime()
      );
      if (!hasNew) {
        fires.push({
          kind: "DELAY",
          forDate: p.nextPeriodDate,
          message: MESSAGES.DELAY,
        });
      }
    }

    for (const fire of fires) {
      let created = false;
      try {
        await prisma.reminderLog.create({
          data: {
            userId: user.id,
            kind: fire.kind,
            forDate: fire.forDate,
            success: false,
          },
        });
        created = true;
      } catch (e) {
        if ((e as { code?: string }).code === "P2002") {
          skipped++;
          continue;
        }
        throw e;
      }

      if (!created) continue;

      const key = `${user.id}:${fire.kind}:${fire.forDate
        .toISOString()
        .slice(0, 10)}`;
      const res = await sendMessage(user.whatsapp, fire.message, key);
      await prisma.reminderLog.updateMany({
        where: { userId: user.id, kind: fire.kind, forDate: fire.forDate },
        data: { success: res.ok },
      });
      if (res.ok) sent++;
    }
  }

  return { processed, sent, skipped };
}

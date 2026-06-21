import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { formatInTimeZone } from "date-fns-tz";

const prisma = new PrismaClient();

// Ancora no "hoje" do fuso de Moçambique (igual ao usado pelo cron),
// para que as datas semeadas batam com as previsões.
function dayUTC(offset: number): Date {
  const ymd = formatInTimeZone(new Date(), "Africa/Maputo", "yyyy-MM-dd");
  const u = new Date(`${ymd}T00:00:00.000Z`);
  u.setUTCDate(u.getUTCDate() + offset);
  return u;
}

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);
  const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Usuária demo (com histórico).
  const demo = await prisma.user.upsert({
    where: { whatsapp: "+258840000000" },
    update: {
      name: "Ana Demo",
      passwordHash,
      whatsappVerified: true,
      onboardingDone: true,
      baseCycleLength: 28,
      basePeriodLength: 5,
      lastPeriodStart: dayUTC(-20),
      trialEndsAt,
      consentAt: new Date(),
    },
    create: {
      whatsapp: "+258840000000",
      name: "Ana Demo",
      passwordHash,
      whatsappVerified: true,
      onboardingDone: true,
      baseCycleLength: 28,
      basePeriodLength: 5,
      lastPeriodStart: dayUTC(-20),
      trialEndsAt,
      consentAt: new Date(),
    },
  });

  // Garante histórico de dois ciclos passados + âncora atual.
  await prisma.cycle.deleteMany({ where: { userId: demo.id } });
  await prisma.cycle.create({
    data: { userId: demo.id, startDate: dayUTC(-76), endDate: dayUTC(-72) },
  });
  await prisma.cycle.create({
    data: { userId: demo.id, startDate: dayUTC(-48), endDate: dayUTC(-44) },
  });
  await prisma.cycle.create({
    data: { userId: demo.id, startDate: dayUTC(-20), endDate: null },
  });

  // Usuária de teste de lembrete (sem ciclos, dispara o lembrete de 3 dias antes).
  const bia = await prisma.user.upsert({
    where: { whatsapp: "+258841111111" },
    update: {
      name: "Bia Teste",
      passwordHash,
      whatsappVerified: true,
      onboardingDone: true,
      baseCycleLength: 28,
      basePeriodLength: 5,
      lastPeriodStart: dayUTC(-25),
      trialEndsAt,
      consentAt: new Date(),
    },
    create: {
      whatsapp: "+258841111111",
      name: "Bia Teste",
      passwordHash,
      whatsappVerified: true,
      onboardingDone: true,
      baseCycleLength: 28,
      basePeriodLength: 5,
      lastPeriodStart: dayUTC(-25),
      trialEndsAt,
      consentAt: new Date(),
    },
  });

  console.log("Seed concluído:");
  console.log(`  - Ana Demo (${demo.whatsapp}) — id ${demo.id}, 3 ciclos.`);
  console.log(`  - Bia Teste (${bia.whatsapp}) — id ${bia.id}, sem ciclos.`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

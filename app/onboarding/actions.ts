"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validation";
import { type ActionState, zodError } from "@/lib/forms";

export async function saveOnboarding(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = onboardingSchema.safeParse({
    lastPeriodStart: formData.get("lastPeriodStart"),
    cycleLength: formData.get("cycleLength"),
    periodLength: formData.get("periodLength"),
  });
  if (!parsed.success) return { error: zodError(parsed.error) };

  const user = await requireUser({ allowOnboarding: true });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingDone: true,
      lastPeriodStart: parsed.data.lastPeriodStart,
      baseCycleLength: parsed.data.cycleLength,
      basePeriodLength: parsed.data.periodLength,
    },
  });

  redirect("/dashboard");
}

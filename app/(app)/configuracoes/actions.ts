"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destroySession } from "@/lib/session";
import { settingsSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/forms";
import { zodError } from "@/lib/forms";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateSettings(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    cycleLength: formData.get("cycleLength"),
    periodLength: formData.get("periodLength"),
  });
  if (!parsed.success) return { error: zodError(parsed.error) };
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      baseCycleLength: parsed.data.cycleLength,
      basePeriodLength: parsed.data.periodLength,
    },
  });
  revalidatePath("/configuracoes");
  revalidatePath("/dashboard");
  return { notice: "Configurações salvas." };
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

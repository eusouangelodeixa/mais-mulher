"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayInMaputo } from "@/lib/today";
import { getSubscriptionState, isActive } from "@/lib/subscription";

export async function startPeriod() {
  const user = await requireUser();
  if (!isActive(getSubscriptionState(user))) redirect("/assinatura");

  const today = todayInMaputo();
  const existing = await prisma.cycle.findFirst({
    where: { userId: user.id, startDate: today },
  });
  if (!existing) {
    await prisma.cycle.create({
      data: { userId: user.id, startDate: today },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/registrar");
  revalidatePath("/historico");
}

export async function endPeriod() {
  const user = await requireUser();
  if (!isActive(getSubscriptionState(user))) redirect("/assinatura");

  const open = await prisma.cycle.findFirst({
    where: { userId: user.id, endDate: null },
    orderBy: { startDate: "desc" },
  });
  const today = todayInMaputo();
  if (open && today.getTime() >= open.startDate.getTime()) {
    await prisma.cycle.update({
      where: { id: open.id },
      data: { endDate: today },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/registrar");
  revalidatePath("/historico");
}

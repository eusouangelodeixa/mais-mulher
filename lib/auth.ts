import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

/** Usuária da sessão atual, ou null (não lança). */
export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

/**
 * Exige uma usuária autenticada. Redireciona para /login se não houver sessão,
 * e para /onboarding se a configuração inicial ainda não foi concluída.
 * Passe { allowOnboarding: true } nas páginas de onboarding.
 */
export async function requireUser(opts?: {
  allowOnboarding?: boolean;
}): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.onboardingDone && !opts?.allowOnboarding) {
    redirect("/onboarding");
  }
  return user;
}

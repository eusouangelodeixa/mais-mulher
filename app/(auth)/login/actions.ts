"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { issueOtp } from "@/lib/otp";
import { sendOtp } from "@/lib/komunika";
import { loginSchema } from "@/lib/validation";

export type ActionState = { error?: string } | null;

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    whatsapp: formData.get("whatsapp"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { whatsapp, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { whatsapp } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Número ou senha incorretos." };
  }

  // Número ainda não verificado: reenvia o código e leva para a verificação.
  if (!user.whatsappVerified) {
    try {
      const code = await issueOtp(user.id, "SIGNUP");
      await sendOtp(user.whatsapp, code);
    } catch {
      // throttle: código recente já foi enviado.
    }
    redirect(`/cadastro/verificar?w=${encodeURIComponent(user.whatsapp)}`);
  }

  await createSession(user.id);
  redirect(user.onboardingDone ? "/dashboard" : "/onboarding");
}

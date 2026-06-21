"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { issueOtp, verifyOtp } from "@/lib/otp";
import { sendOtp } from "@/lib/komunika";
import { otpSchema } from "@/lib/validation";
import { zodError, otpErrorMessage, type ActionState } from "@/lib/forms";

export async function verify(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const whatsapp = String(formData.get("whatsapp") ?? "");
  const parsed = otpSchema.safeParse({ code: formData.get("code") });
  if (!parsed.success) return { error: zodError(parsed.error) };

  const user = await prisma.user.findUnique({ where: { whatsapp } });
  if (!user) return { error: "Conta não encontrada." };

  const result = await verifyOtp(user.id, "SIGNUP", parsed.data.code);
  if (!result.ok) return { error: otpErrorMessage(result.reason) };

  await prisma.user.update({
    where: { id: user.id },
    data: { whatsappVerified: true },
  });
  await createSession(user.id);
  redirect(user.onboardingDone ? "/dashboard" : "/onboarding");
}

export async function resend(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const whatsapp = String(formData.get("whatsapp") ?? "");
  const user = await prisma.user.findUnique({ where: { whatsapp } });
  if (!user) return { error: "Conta não encontrada." };

  try {
    const code = await issueOtp(user.id, "SIGNUP");
    await sendOtp(whatsapp, code);
    return { notice: "Novo código enviado pelo WhatsApp." };
  } catch {
    return { error: "Aguarde um minuto para reenviar o código." };
  }
}

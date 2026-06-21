"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { verifyOtp } from "@/lib/otp";
import { resetPasswordSchema } from "@/lib/validation";
import { zodError, otpErrorMessage, type ActionState } from "@/lib/forms";

export async function resetPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    whatsapp: formData.get("whatsapp"),
    code: formData.get("code"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: zodError(parsed.error) };

  const { whatsapp, code, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { whatsapp } });
  if (!user) return { error: "Conta não encontrada." };

  const result = await verifyOtp(user.id, "RECOVERY", code);
  if (!result.ok) return { error: otpErrorMessage(result.reason) };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, whatsappVerified: true },
  });
  await createSession(user.id);
  redirect(user.onboardingDone ? "/dashboard" : "/onboarding");
}

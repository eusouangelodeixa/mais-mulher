"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { issueOtp } from "@/lib/otp";
import { sendOtp } from "@/lib/komunika";
import { signupSchema } from "@/lib/validation";
import { zodError, type ActionState } from "@/lib/forms";

const TRIAL_DAYS = 7;

export async function signup(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: zodError(parsed.error) };

  const { name, whatsapp, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { whatsapp } });
  if (existing?.whatsappVerified) {
    return { error: "Este número já tem conta. Faça login." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let userId: string;
  if (existing) {
    // Cadastro anterior não concluído: atualiza dados e reenvia o código.
    await prisma.user.update({
      where: { id: existing.id },
      data: { name, passwordHash },
    });
    userId = existing.id;
  } else {
    const user = await prisma.user.create({
      data: {
        name,
        whatsapp,
        passwordHash,
        consentAt: new Date(),
        trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
      },
    });
    userId = user.id;
  }

  try {
    const code = await issueOtp(userId, "SIGNUP");
    await sendOtp(whatsapp, code);
  } catch {
    // throttle: um código recente já foi enviado; segue para a verificação.
  }

  redirect(`/cadastro/verificar?w=${encodeURIComponent(whatsapp)}`);
}

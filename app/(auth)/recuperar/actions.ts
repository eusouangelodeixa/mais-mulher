"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { issueOtp } from "@/lib/otp";
import { sendOtp } from "@/lib/komunika";
import { requestRecoverySchema } from "@/lib/validation";
import { zodError, type ActionState } from "@/lib/forms";

export async function requestRecovery(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = requestRecoverySchema.safeParse({
    whatsapp: formData.get("whatsapp"),
  });
  if (!parsed.success) return { error: zodError(parsed.error) };

  const { whatsapp } = parsed.data;
  const user = await prisma.user.findUnique({ where: { whatsapp } });

  // Não revela se o número existe: sempre segue para a tela de redefinição.
  if (user) {
    try {
      const code = await issueOtp(user.id, "RECOVERY");
      await sendOtp(whatsapp, code);
    } catch {
      // throttle
    }
  }

  redirect(`/recuperar/redefinir?w=${encodeURIComponent(whatsapp)}`);
}

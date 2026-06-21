"use server";

import { redirect } from "next/navigation";
import { activateLeadAccount } from "@/lib/leads";
import { createSession } from "@/lib/session";
import { activationSchema } from "@/lib/validation";
import { zodError, type ActionState } from "@/lib/forms";

export async function activate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = activationSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: zodError(parsed.error) };

  const result = await activateLeadAccount(
    parsed.data.token,
    parsed.data.password,
  );
  if (!result.ok) {
    return {
      error:
        result.reason === "used"
          ? "Este acesso já foi ativado. Faça login."
          : "Link de ativação inválido ou expirado.",
    };
  }

  await createSession(result.userId);
  redirect("/onboarding");
}

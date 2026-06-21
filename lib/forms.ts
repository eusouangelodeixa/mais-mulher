import type { z } from "zod";
import type { VerifyResult } from "@/lib/otp";

// Estado padrão das server actions usadas com useActionState.
export type ActionState = { error?: string; notice?: string } | null;

export function zodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos";
}

export function otpErrorMessage(
  reason: Extract<VerifyResult, { ok: false }>["reason"],
): string {
  switch (reason) {
    case "not_found":
      return "Código não encontrado. Reenvie o código.";
    case "expired":
      return "Código expirado. Reenvie o código.";
    case "locked":
      return "Muitas tentativas. Reenvie o código.";
    case "mismatch":
      return "Código incorreto.";
  }
}

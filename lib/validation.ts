import { z } from "zod";

/**
 * Normaliza um número de WhatsApp moçambicano para E.164 (+258XXXXXXXXX).
 * Aceita formatos como "841234567", "258841234567", "+258 84 123 4567".
 * Retorna null se não parecer um número móvel válido de Moçambique.
 */
export function normalizeWhatsapp(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9 && digits.startsWith("8")) {
    digits = "258" + digits;
  }
  // Esperado: 258 + 9 dígitos começando por 8 (82..87).
  if (/^258(8[2-7])\d{7}$/.test(digits)) {
    return "+" + digits;
  }
  return null;
}

const whatsapp = z
  .string()
  .trim()
  .min(1, "Informe o número de WhatsApp")
  .transform((v, ctx) => {
    const normalized = normalizeWhatsapp(v);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número de WhatsApp inválido (use um número moçambicano).",
      });
      return z.NEVER;
    }
    return normalized;
  });

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  whatsapp,
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  whatsapp,
  password: z.string().min(1, "Informe sua senha"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "O código deve ter 4 dígitos"),
});

export const requestRecoverySchema = z.object({ whatsapp });

export const resetPasswordSchema = z.object({
  whatsapp,
  code: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "O código deve ter 4 dígitos"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const onboardingSchema = z.object({
  lastPeriodStart: z.coerce
    .date({ message: "Informe uma data válida" })
    .refine((d) => d.getTime() <= Date.now(), "A data não pode ser no futuro"),
  cycleLength: z.coerce
    .number()
    .int()
    .min(15, "Ciclo muito curto")
    .max(60, "Ciclo muito longo"),
  periodLength: z.coerce
    .number()
    .int()
    .min(1, "Duração inválida")
    .max(15, "Duração muito longa"),
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  cycleLength: z.coerce.number().int().min(15).max(60),
  periodLength: z.coerce.number().int().min(1).max(15),
});

// Captura de lead (fluxo pay-first): Nome + WhatsApp antes do checkout.
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  whatsapp,
});

// Ativação de acesso após o pagamento (define a senha da conta).
export const activationSchema = z.object({
  token: z.string().trim().min(1, "Token inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

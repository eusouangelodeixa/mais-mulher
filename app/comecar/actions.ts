"use server";

import { redirect } from "next/navigation";
import { captureLead } from "@/lib/leads";
import { lojouCheckoutUrl } from "@/lib/lojou";
import { leadSchema } from "@/lib/validation";
import { zodError, type ActionState } from "@/lib/forms";

export async function startCheckout(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
  });
  if (!parsed.success) return { error: zodError(parsed.error) };

  await captureLead({
    name: parsed.data.name,
    whatsapp: parsed.data.whatsapp,
  });

  // Segue para o checkout hospedado da Lojou (M-Pesa / E-mola).
  redirect(lojouCheckoutUrl());
}

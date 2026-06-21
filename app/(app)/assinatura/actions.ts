"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initiatePayment } from "@/lib/lojou";
import { paymentSchema } from "@/lib/validation";
import { zodError, type ActionState } from "@/lib/forms";
import { confirmPayment } from "@/lib/payments";

export async function startPayment(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = paymentSchema.safeParse({ method: formData.get("method") });
  if (!parsed.success) return { error: zodError(parsed.error) };
  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      amountMt: 47,
      method: parsed.data.method,
      status: "PENDING",
    },
  });
  const result = await initiatePayment({
    userId: user.id,
    phone: user.whatsapp,
    method: parsed.data.method,
    amountMt: 47,
    reference: payment.id,
  });
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      lojouRef: result.ref || null,
      checkoutUrl: result.checkoutUrl ?? null,
    },
  });
  if (result.status === "CONFIRMED") {
    await confirmPayment(payment.id);
    revalidatePath("/assinatura");
    revalidatePath("/dashboard");
    return { notice: "Pagamento confirmado! Assinatura ativa." };
  }
  if (result.checkoutUrl) {
    redirect(result.checkoutUrl);
  }
  return { error: "Não foi possível iniciar o pagamento. Tente novamente." };
}

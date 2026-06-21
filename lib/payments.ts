import { prisma } from "@/lib/prisma";
import { extendPaidUntil } from "@/lib/subscription";

export async function confirmPayment(paymentId: string): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { user: true },
  });
  if (!payment || payment.status === "CONFIRMED") return;
  const newPaidUntil = extendPaidUntil(payment.user.paidUntil);
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
        paidUntilSnapshot: newPaidUntil,
      },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: { paidUntil: newPaidUntil },
    }),
  ]);
}

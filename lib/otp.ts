import "server-only";
import bcrypt from "bcryptjs";
import type { OtpPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutos
const MAX_ATTEMPTS = 5;
const RESEND_THROTTLE_MS = 60 * 1000; // 1 reenvio por minuto

/** Gera um código aleatório de 4 dígitos (string "0000"–"9999"). */
function generateCode(): string {
  // crypto.randomInt está disponível no runtime Node (server actions / route handlers).
  const n = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 * 10000);
  return String(n).padStart(4, "0");
}

/**
 * Cria um novo código OTP para a usuária, devolvendo o código em texto puro
 * (para ser enviado pelo Komunika). O hash é armazenado no banco.
 * Lança "throttle" se o último código foi gerado há menos de 60s.
 */
export async function issueOtp(
  userId: string,
  purpose: OtpPurpose,
): Promise<string> {
  const last = await prisma.otpCode.findFirst({
    where: { userId, purpose },
    orderBy: { createdAt: "desc" },
  });
  if (last && Date.now() - last.createdAt.getTime() < RESEND_THROTTLE_MS) {
    throw new Error("throttle");
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);

  await prisma.otpCode.create({
    data: {
      userId,
      purpose,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  return code;
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "locked" | "mismatch" };

/**
 * Verifica um código OTP. Em caso de sucesso, marca o código como consumido.
 * Incrementa tentativas e trava após 5 falhas.
 */
export async function verifyOtp(
  userId: string,
  purpose: OtpPurpose,
  code: string,
): Promise<VerifyResult> {
  const otp = await prisma.otpCode.findFirst({
    where: { userId, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return { ok: false, reason: "not_found" };
  if (otp.expiresAt.getTime() < Date.now()) return { ok: false, reason: "expired" };
  if (otp.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "locked" };

  const match = await bcrypt.compare(code, otp.codeHash);
  if (!match) {
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "mismatch" };
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { consumedAt: new Date() },
  });
  return { ok: true };
}

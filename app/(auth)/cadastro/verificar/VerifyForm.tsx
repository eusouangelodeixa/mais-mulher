"use client";

import { useActionState } from "react";
import { verify, resend } from "./actions";
import { Field, Input, ErrorText } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

export function VerifyForm({ whatsapp }: { whatsapp: string }) {
  const [verifyState, verifyAction] = useActionState(verify, null);
  const [resendState, resendAction] = useActionState(resend, null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verificar número</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enviamos um código de 4 dígitos para o WhatsApp{" "}
          <span className="font-medium text-gray-800">{whatsapp}</span>.
        </p>
      </div>

      <form action={verifyAction} className="space-y-4">
        <input type="hidden" name="whatsapp" value={whatsapp} />
        <Field label="Código de verificação" htmlFor="code">
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            placeholder="0000"
            className="text-center text-2xl tracking-[0.5em]"
            required
          />
        </Field>

        <ErrorText>{verifyState?.error}</ErrorText>

        <SubmitButton pendingLabel="Verificando...">Verificar</SubmitButton>
      </form>

      <form action={resendAction} className="text-center">
        <input type="hidden" name="whatsapp" value={whatsapp} />
        {resendState?.notice ? (
          <p className="mb-2 text-sm text-green-700">{resendState.notice}</p>
        ) : null}
        {resendState?.error ? (
          <p className="mb-2 text-sm text-red-700">{resendState.error}</p>
        ) : null}
        <button type="submit" className="text-sm font-medium text-brand-700">
          Reenviar código
        </button>
      </form>
    </div>
  );
}

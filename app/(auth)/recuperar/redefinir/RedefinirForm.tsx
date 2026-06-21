"use client";

import { useActionState } from "react";
import { resetPassword } from "./actions";
import { Field, Input, ErrorText } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

export function RedefinirForm({ whatsapp }: { whatsapp: string }) {
  const [state, action] = useActionState(resetPassword, null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Redefinir senha</h1>
        <p className="mt-1 text-sm text-gray-600">
          Digite o código enviado para{" "}
          <span className="font-medium text-gray-800">{whatsapp}</span> e escolha
          uma nova senha.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="whatsapp" value={whatsapp} />
        <Field label="Código de verificação" htmlFor="code">
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            maxLength={4}
            placeholder="0000"
            className="text-center text-2xl tracking-[0.5em]"
            required
          />
        </Field>
        <Field label="Nova senha" htmlFor="password" hint="Mínimo de 6 caracteres.">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
            required
          />
        </Field>

        <ErrorText>{state?.error}</ErrorText>

        <SubmitButton pendingLabel="Salvando...">Redefinir senha</SubmitButton>
      </form>
    </div>
  );
}

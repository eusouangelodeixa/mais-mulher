"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestRecovery } from "./actions";
import { Field, Input, ErrorText } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

export default function RecuperarPage() {
  const [state, action] = useActionState(requestRecovery, null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recuperar conta</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enviaremos um código pelo WhatsApp para você redefinir a senha.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <Field label="Número de WhatsApp" htmlFor="whatsapp">
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            placeholder="84 123 4567"
            required
          />
        </Field>

        <ErrorText>{state?.error}</ErrorText>

        <SubmitButton pendingLabel="Enviando...">Enviar código</SubmitButton>
      </form>

      <p className="text-center text-sm text-gray-600">
        <Link href="/login" className="font-semibold text-brand-700">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "./actions";
import { Field, Input, ErrorText } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

export default function CadastroPage() {
  const [state, action] = useActionState(signup, null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
        <p className="mt-1 text-sm text-gray-600">
          Leva menos de 2 minutos. Você tem 7 dias grátis.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <Field label="Nome" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" placeholder="Seu nome" required />
        </Field>
        <Field
          label="Número de WhatsApp"
          htmlFor="whatsapp"
          hint="Enviaremos um código de verificação por WhatsApp."
        >
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="84 123 4567"
            required
          />
        </Field>
        <Field label="Senha" htmlFor="password" hint="Mínimo de 6 caracteres.">
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

        <SubmitButton pendingLabel="Criando...">Criar conta</SubmitButton>
      </form>

      <p className="text-center text-xs text-gray-500">
        Ao criar a conta, você concorda com o uso dos seus dados para gerar
        previsões e lembretes do seu ciclo.
      </p>

      <p className="text-center text-sm text-gray-600">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-brand-700">
          Entrar
        </Link>
      </p>
    </div>
  );
}

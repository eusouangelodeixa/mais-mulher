"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "./actions";
import { Field, Input, ErrorText } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

export default function LoginPage() {
  const [state, action] = useActionState(login, null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
        <p className="mt-1 text-sm text-gray-600">
          Acompanhe seu ciclo e receba lembretes pelo WhatsApp.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <Field label="Número de WhatsApp" htmlFor="whatsapp">
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="username"
            placeholder="84 123 4567"
            required
          />
        </Field>
        <Field label="Senha" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••"
            required
          />
        </Field>

        <ErrorText>{state?.error}</ErrorText>

        <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
      </form>

      <div className="space-y-2 text-center text-sm">
        <p>
          <Link href="/recuperar" className="font-medium text-brand-700">
            Esqueci minha senha
          </Link>
        </p>
        <p className="text-gray-600">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-brand-700">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

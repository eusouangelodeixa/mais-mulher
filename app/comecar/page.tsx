"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";
import { startCheckout } from "./actions";

export default function ComecarPage() {
  const [state, action] = useActionState(startCheckout, null);

  return (
    <div className="landing flex min-h-dvh flex-col bg-background text-foreground">
      <div className="glow-rose pointer-events-none absolute inset-x-0 top-0 -z-0 h-80" />
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Lock className="size-3.5" /> Pagamento seguro
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-2xl shadow-black/40 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-soft">
            Falta pouco 🌸
          </p>
          <h1 className="font-display mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            Quase lá!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha seus dados para continuar. Logo após o pagamento, você
            recebe o acesso no seu WhatsApp.
          </p>

          <form action={action} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                required
                className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-foreground"
              >
                Número de WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="84 123 4567"
                required
                className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-xs text-muted-foreground">
                É neste número que você vai receber o acesso e os lembretes.
              </p>
            </div>

            {state?.error ? (
              <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-rose-soft">
                {state.error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full">
              Ir para o pagamento
              <ArrowRight />
            </Button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-rose" />
            Pague com M-Pesa ou E-mola · 67 MT/mês
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-rose-soft">
            Entrar
          </Link>
        </p>
      </main>
    </div>
  );
}

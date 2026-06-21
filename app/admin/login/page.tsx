"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";
import { adminLogin } from "./actions";

export default function AdminLoginPage() {
  const [state, action] = useActionState(adminLogin, null);

  return (
    <div className="landing flex min-h-dvh flex-col items-center justify-center bg-background px-5 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Lock className="size-4" /> Painel administrativo
          </p>
        </div>

        <form
          action={action}
          className="space-y-4 rounded-3xl border border-border bg-card p-7 shadow-2xl shadow-black/40"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Senha de admin
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {state?.error ? (
            <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-rose-soft">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}

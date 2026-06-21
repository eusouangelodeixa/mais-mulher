"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { activate } from "./actions";

export function ActivateForm({
  token,
  name,
}: {
  token: string;
  name: string;
}) {
  const [state, action] = useActionState(activate, null);

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          Nome
        </label>
        <input
          value={name}
          readOnly
          className="w-full rounded-xl border border-border bg-secondary/20 px-4 py-3 text-base text-muted-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Crie uma senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Pelo menos 6 caracteres"
          minLength={6}
          required
          className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-rose-soft">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full">
        Ativar meu acesso
        <ArrowRight />
      </Button>
    </form>
  );
}

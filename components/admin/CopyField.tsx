"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

export function CopyField({
  value,
  secret = false,
}: {
  value: string;
  secret?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!secret);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard indisponível (ex.: http sem permissão) — ignora
    }
  }

  return (
    <div className="flex items-stretch gap-2">
      <input
        readOnly
        type={revealed ? "text" : "password"}
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2.5 font-mono text-xs text-foreground outline-none"
      />
      {secret ? (
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-label={revealed ? "Ocultar" : "Revelar"}
          className="inline-flex shrink-0 items-center rounded-xl border border-border bg-secondary px-3 text-foreground transition-colors hover:border-primary/40"
        >
          {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      ) : null}
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary/70"
      >
        {copied ? (
          <>
            <Check className="size-4 text-rose" /> Copiado
          </>
        ) : (
          <>
            <Copy className="size-4" /> Copiar
          </>
        )}
      </button>
    </div>
  );
}

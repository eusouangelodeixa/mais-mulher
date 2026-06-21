import * as React from "react";

import { cn } from "@/lib/utils";

/** Glifo de flor (bloom) — marca do +Mulher. */
function Bloom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="currentColor">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse
            key={a}
            cx="12"
            cy="6.6"
            rx="2.45"
            ry="4"
            transform={`rotate(${a} 12 12)`}
            opacity="0.95"
          />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.4" fill="#ff5d8a" />
    </svg>
  );
}

/**
 * Logo do +Mulher. Use `iconOnly` para apenas a marca (ex.: avatar),
 * ou a versão completa com o wordmark.
 */
export function Logo({
  className,
  iconOnly = false,
  wordmarkClassName,
}: {
  className?: string;
  iconOnly?: boolean;
  wordmarkClassName?: string;
}) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-rose to-violet-soft text-white shadow-sm shadow-primary/30",
        iconOnly ? className : "size-9",
      )}
    >
      <Bloom className="size-[60%]" />
    </span>
  );

  if (iconOnly) return mark;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      <span
        className={cn(
          "font-display text-xl font-bold tracking-tight text-foreground",
          wordmarkClassName,
        )}
      >
        <span className="text-rose">+</span>Mulher
      </span>
    </span>
  );
}

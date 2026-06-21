import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Largura máxima de conteúdo, com respiro lateral mobile-first. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** Espaçamento vertical padrão entre seções. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

/** Etiqueta pequena acima dos títulos. */
export function Eyebrow({
  children,
  className,
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-rose-soft",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Cabeçalho de seção: etiqueta + título + subtítulo. */
export function SectionHeading({
  eyebrow,
  icon,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow icon={icon}>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display max-w-2xl text-balance text-3xl font-bold leading-[1.08] sm:text-[2.6rem]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** Botão de conversão padrão. Aponta sempre para /cadastro. */
export function CtaButton({
  children = "Começar agora",
  href = "/cadastro",
  size = "lg",
  variant,
  className,
}: {
  children?: React.ReactNode;
  href?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  className?: string;
}) {
  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

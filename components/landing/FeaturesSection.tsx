import * as React from "react";
import { Check } from "lucide-react";

import {
  Section,
  Container,
  SectionHeading,
} from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { Card } from "@/components/ui/card";

const features: string[] = [
  "Próxima menstruação prevista e dias restantes",
  "Dia atual do ciclo",
  "Próximo período fértil",
  "Histórico completo dos seus ciclos",
  "Conteúdo educativo sobre saúde menstrual",
];

/** Anel/donut ilustrativo do ciclo — desenhado em SVG, sem dados reais. */
function CycleRing() {
  // Geometria do anel.
  const size = 168;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // ~50% preenchido, apenas ilustrativo do progresso do ciclo.
  const progress = 0.5;

  return (
    <div
      aria-hidden
      className="relative mx-auto flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id="cycleRingFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--rose)" />
            <stop offset="100%" stopColor="var(--violet-soft)" />
          </linearGradient>
        </defs>
        {/* Trilho de fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        {/* Progresso do ciclo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#cycleRingFill)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>

      {/* Número central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold leading-none text-foreground">
          Dia 14
        </span>
        <span className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-rose-soft">
          do ciclo
        </span>
      </div>
    </div>
  );
}

/** O APP — mockup estilizado do painel + lista de funcionalidades. */
export function FeaturesSection() {
  return (
    <Section id="aprender">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="O app"
            title="Tudo o que importa, num só lugar"
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-14">
          {/* Mockup do painel */}
          <Reveal delay={120}>
            <Card className="relative overflow-hidden rounded-3xl border-primary/20 bg-card p-6 sm:p-8">
              {/* Glow rosa discreto ao fundo */}
              <div
                aria-hidden
                className="glow-rose pointer-events-none absolute -right-12 -top-16 size-56 opacity-50"
              />

              <div className="relative flex flex-col gap-6">
                {/* Cabeçalho do painel */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Seu ciclo
                  </span>
                  <span className="size-2.5 rounded-full bg-rose" aria-hidden />
                </div>

                {/* Anel do ciclo */}
                <CycleRing />

                {/* Próxima menstruação */}
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-sm text-muted-foreground">
                    Próxima menstruação
                  </span>
                  <span className="font-display text-lg font-semibold text-foreground">
                    em 5 dias
                  </span>
                </div>

                {/* Mini-chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/12 px-3 py-1.5 text-xs font-semibold text-rose">
                    <span className="size-1.5 rounded-full bg-rose" aria-hidden />
                    Período fértil
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    <span
                      className="size-1.5 rounded-full bg-violet-soft"
                      aria-hidden
                    />
                    Ciclo de 28 dias
                  </span>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* Lista de funcionalidades */}
          <Reveal delay={240}>
            <ul className="flex flex-col gap-5">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-rose">
                    <Check className="size-4" />
                  </span>
                  <span className="text-pretty text-base leading-snug text-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

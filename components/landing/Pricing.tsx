import * as React from "react";
import { Check } from "lucide-react";

import { Section, Container, SectionHeading, CtaButton } from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const benefits: string[] = [
  "Registro ilimitado de ciclos",
  "Histórico completo",
  "Previsões automáticas",
  "Lembretes via WhatsApp",
  "Conteúdo educativo",
];

/** PREÇO — um único plano premium, sem comparação grátis vs pago. */
export function Pricing() {
  return (
    <Section id="preco">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Preço"
            title="Um plano. Tudo incluído."
            align="center"
          />

          <div className="relative mx-auto mt-12 max-w-md">
            {/* Brilho de marca discreto por trás do card. */}
            <div
              aria-hidden
              className="glow-rose pointer-events-none absolute inset-0 -z-10 opacity-70"
            />

            <Card className="relative items-center gap-7 rounded-3xl border-primary/20 bg-card p-8 text-center sm:p-10">
              <Badge variant="soft">Plano único</Badge>

              <div className="flex items-end justify-center gap-2">
                <span className="font-display text-5xl font-bold leading-none tracking-tight text-rose sm:text-6xl">
                  67 MT
                </span>
                <span className="pb-1 text-sm text-muted-foreground">/ mês</span>
              </div>

              <ul className="flex w-full flex-col gap-3.5 text-left">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <Check className="size-5 shrink-0 text-rose" />
                    <span className="text-pretty leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>

              <CtaButton size="lg" className="w-full">
                Assinar agora
              </CtaButton>

              <div className="flex flex-col items-center gap-2.5">
                <p className="text-xs text-muted-foreground">
                  Pague com M-Pesa ou E-mola
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                    M-Pesa
                  </span>
                  <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                    e-Mola
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

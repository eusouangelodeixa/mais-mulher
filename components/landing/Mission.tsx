import * as React from "react";
import { Heart } from "lucide-react";

import { Section, Container, SectionHeading, CtaButton } from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/landing/Logo";

export function Mission() {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Nossa missão"
            title="Por que criamos o +Mulher"
            align="left"
          />
        </Reveal>

        <Reveal delay={120}>
          <Card className="relative mt-10 overflow-hidden rounded-3xl border-primary/20 bg-card p-7 sm:p-10">
            {/* Detalhe gráfico sutil: glow rosa discreto atrás do conteúdo. */}
            <div
              aria-hidden
              className="glow-rose pointer-events-none absolute -right-16 -top-20 size-64 opacity-60"
            />

            <div className="relative flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Logo iconOnly className="size-12 shrink-0" />
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-rose">
                  <Heart className="size-6" />
                </span>
              </div>

              <div className="flex max-w-prose flex-col gap-4">
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Milhares de mulheres moçambicanas não têm uma forma simples de acompanhar o
                  próprio ciclo. O resultado é menstruação que surpreende, ansiedade com atrasos
                  e pouca informação sobre o próprio corpo.
                </p>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Criámos o <span className="text-rose font-semibold">+Mulher</span> para mudar
                  isso — de um jeito direto, em português, e que conversa com você onde você já
                  está todos os dias: no WhatsApp.
                </p>
              </div>

              <div>
                <CtaButton variant="outline">Fazer parte</CtaButton>
              </div>
            </div>
          </Card>
        </Reveal>
      </Container>
    </Section>
  );
}

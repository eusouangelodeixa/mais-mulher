import { Sparkles } from "lucide-react";

import { Section, Container, CtaButton } from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { Logo } from "@/components/landing/Logo";

/** CTA FINAL — faixa de fechamento acolhedora que leva ao cadastro. */
export function FinalCTA() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 to-card px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* Brilho de marca por trás */}
            <div className="glow-rose absolute inset-0 -z-10" aria-hidden />

            {/* Detalhe gráfico discreto */}
            <Sparkles
              className="absolute right-6 top-6 size-8 text-rose/30 sm:right-10 sm:top-10 sm:size-10"
              aria-hidden
            />

            <div className="flex flex-col items-center gap-6">
              <Logo iconOnly className="size-12" />

              <h2 className="font-display max-w-2xl text-balance text-3xl font-bold leading-[1.08] sm:text-[2.6rem]">
                Comece a entender o seu ciclo hoje.
              </h2>

              <CtaButton size="lg">Começar agora</CtaButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

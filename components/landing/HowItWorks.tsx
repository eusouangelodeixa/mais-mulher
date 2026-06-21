import { CalendarPlus, Sparkles, BellRing } from "lucide-react";

import {
  Section,
  Container,
  SectionHeading,
  CtaButton,
} from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Registre",
    description: "Informe sua última menstruação. Leva menos de 2 minutos.",
    icon: <CalendarPlus className="size-6" />,
  },
  {
    number: "02",
    title: "Receba a previsão",
    description: "Veja a data da próxima menstruação e do seu período fértil.",
    icon: <Sparkles className="size-6" />,
  },
  {
    number: "03",
    title: "Seja avisada",
    description: "Receba lembretes no WhatsApp, sem abrir o app.",
    icon: <BellRing className="size-6" />,
  },
];

/** COMO FUNCIONA — três passos simples até o primeiro lembrete. */
export function HowItWorks() {
  return (
    <Section id="como-funciona">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Como funciona" title="Simples assim" align="center" />
        </Reveal>

        <div className="relative mt-14 sm:mt-16">
          {/* Linha conectora sutil no desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[16%] top-6 hidden border-t border-dashed border-border md:block"
          />

          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 120}>
                <li className="relative flex flex-col items-center gap-4 text-center">
                  <span className="font-display text-5xl font-bold leading-none text-rose">
                    {step.number}
                  </span>
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-rose">
                    {step.icon}
                  </span>
                  <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                  <p className="max-w-xs text-pretty text-base text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={360}>
          <div className="mt-14 flex justify-center sm:mt-16">
            <CtaButton size="lg">Começar agora</CtaButton>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

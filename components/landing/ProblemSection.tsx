import * as React from "react";
import { CalendarX2, CloudRain, HelpCircle, BellOff } from "lucide-react";

import { Section, Container, SectionHeading } from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { Card } from "@/components/ui/card";

type Pain = {
  icon: React.ReactNode;
  text: React.ReactNode;
};

const PAINS: Pain[] = [
  {
    icon: <CalendarX2 className="size-6" />,
    text: "Menstruação que chega de surpresa, na pior hora.",
  },
  {
    icon: <CloudRain className="size-6" />,
    text: "Ansiedade toda vez que atrasa.",
  },
  {
    icon: <HelpCircle className="size-6" />,
    text: "Não entender direito o próprio ciclo.",
  },
  {
    icon: <BellOff className="size-6" />,
    text: "Nenhum lembrete que realmente funcione.",
  },
];

export function ProblemSection() {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading eyebrow="O problema" title="Você reconhece isso?" align="center" />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2">
          {PAINS.map((pain, i) => (
            <Reveal key={i} delay={i * 120}>
              <Card className="flex h-full flex-row items-center gap-4 transition-colors hover:border-primary/20">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-rose">
                  {pain.icon}
                </span>
                <p className="text-pretty text-base font-medium leading-snug text-foreground">
                  {pain.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mx-auto mt-12 max-w-xl text-balance text-center text-lg text-muted-foreground sm:text-xl">
            O <span className="text-rose font-semibold">+Mulher</span> resolve isso de um jeito
            simples.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

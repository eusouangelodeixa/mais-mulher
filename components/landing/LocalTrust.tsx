import * as React from "react";
import { Languages, Wallet, ShieldCheck } from "lucide-react";

import {
  Section,
  Container,
  SectionHeading,
} from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

type TrustPoint = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const points: TrustPoint[] = [
  {
    title: "Em português, para moçambicanas.",
    description: "Feito para a nossa realidade.",
    icon: <Languages className="size-6" />,
  },
  {
    title: "Pague com M-Pesa ou E-mola.",
    description: "Simples, do jeito que você já paga.",
    icon: <Wallet className="size-6" />,
  },
  {
    title: "Seus dados são privados.",
    description:
      "Suas informações são suas, usadas apenas para suas previsões e lembretes.",
    icon: <ShieldCheck className="size-6" />,
  },
];

/** Selo de pagamento estilizado (não é logo oficial — apenas um rótulo). */
function PaymentChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground">
      <Wallet className="size-3.5 text-rose" />
      {label}
    </span>
  );
}

/** CONFIANÇA LOCAL — três pontos de confiança pensados para Moçambique. */
export function LocalTrust() {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Confiança"
            title="Pensado para você"
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 120}>
              <Card className="h-full rounded-2xl">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-rose">
                  {point.icon}
                </span>
                <CardTitle>{point.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {point.description}
                </CardDescription>

                {/* Selos de pagamento, apenas no ponto do M-Pesa / E-mola. */}
                {i === 1 ? (
                  <div className="flex flex-wrap gap-2">
                    <PaymentChip label="M-Pesa" />
                    <PaymentChip label="e-Mola" />
                  </div>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

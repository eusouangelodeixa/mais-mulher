import * as React from "react";

import { Section, Container, SectionHeading } from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "Preciso baixar algum app?",
    answer:
      "Não. O +Mulher funciona direto no seu navegador, sem ocupar espaço no telemóvel.",
  },
  {
    question: "Como faço o pagamento?",
    answer: "Por M-Pesa ou E-mola, de forma simples e rápida.",
  },
  {
    question: "Os meus dados são privados?",
    answer:
      "Sim. Suas informações são suas e usadas apenas para gerar suas previsões e lembretes.",
  },
  {
    question: "E se eu trocar de telemóvel?",
    answer:
      "Sua conta e seu histórico continuam salvos. É só entrar de novo com o seu número.",
  },
  {
    question: "Como cancelo?",
    answer: "A qualquer momento, sem complicação.",
  },
  {
    question: "Os lembretes chegam mesmo no WhatsApp?",
    answer:
      "Sim — é o coração do +Mulher. Você é avisada por lá antes da próxima menstruação.",
  },
];

/** FAQ — perguntas frequentes em acordeão. */
export function FAQ() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading title="Perguntas frequentes" align="center" />

          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`q${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </Section>
  );
}

import {
  MessageCircle,
  CalendarClock,
  BellRing,
  CalendarHeart,
  Sparkles,
} from "lucide-react";

import {
  Section,
  Container,
  SectionHeading,
  CtaButton,
} from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { ChatBubble, WaScreen, PhoneFrame } from "@/components/landing/whatsapp";

type TimelineItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const timeline: TimelineItem[] = [
  {
    title: "3 dias antes",
    description: "Um aviso antecipado para você se preparar.",
    icon: <CalendarClock className="size-6" />,
  },
  {
    title: "1 dia antes",
    description: "O lembrete véspera, para não ser pega de surpresa.",
    icon: <BellRing className="size-6" />,
  },
  {
    title: "No dia previsto",
    description: "Confirmação no dia esperado do seu ciclo.",
    icon: <CalendarHeart className="size-6" />,
  },
  {
    title: "Período fértil",
    description: "Aviso quando sua janela fértil se aproxima.",
    icon: <Sparkles className="size-6" />,
  },
];

/**
 * WHATSAPP — a seção-âncora da landing do +Mulher.
 * Mostra os lembretes reais chegando no WhatsApp e quando cada um aparece.
 */
export function WhatsAppSection() {
  return (
    <Section id="whatsapp">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="O diferencial"
            icon={<MessageCircle className="size-3.5" />}
            title="Você não precisa lembrar. A gente lembra por você."
            subtitle="Receba lembretes no WhatsApp, onde você já está todo dia."
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-14 sm:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* Linha do tempo — quando cada lembrete chega */}
          <div className="order-2 lg:order-1">
            <ol className="relative flex flex-col gap-8">
              {/* Linha conectora vertical sutil */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-6 left-6 top-6 border-l border-border"
              />

              {timeline.map((item, i) => (
                <Reveal key={item.title} delay={i * 120}>
                  <li className="relative flex items-start gap-5">
                    <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-rose ring-4 ring-background">
                      {item.icon}
                    </span>
                    <div className="flex flex-col gap-1 pt-1">
                      <h3 className="font-display text-lg font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-pretty text-base text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Telemóvel com os lembretes reais */}
          <div className="relative order-1 w-full lg:order-2">
            <div className="glow-rose absolute inset-0 -z-10" />
            <Reveal delay={120}>
              <PhoneFrame>
                <WaScreen>
                  <Reveal delay={0}>
                    <ChatBubble direction="in" time="08:00">
                      Olá! Sua próxima menstruação está prevista para os próximos
                      dias. Prepare-se com antecedência. 🌸
                    </ChatBubble>
                  </Reveal>
                  <Reveal delay={150}>
                    <ChatBubble direction="in" time="08:00">
                      Lembrete: sua menstruação está prevista para amanhã. 💜
                    </ChatBubble>
                  </Reveal>
                  <Reveal delay={300}>
                    <ChatBubble direction="in" time="08:00">
                      Hoje é a data prevista para o início do seu ciclo menstrual.
                    </ChatBubble>
                  </Reveal>
                  <Reveal delay={450}>
                    <ChatBubble direction="in" time="08:00">
                      Seu período fértil está se aproximando.
                    </ChatBubble>
                  </Reveal>
                </WaScreen>
              </PhoneFrame>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-14 flex justify-center sm:mt-16">
            <CtaButton size="lg">Começar agora</CtaButton>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

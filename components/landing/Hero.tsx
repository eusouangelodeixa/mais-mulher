import { MessageCircle } from "lucide-react";

import { Section, Container, Eyebrow, CtaButton } from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/Reveal";
import { Badge } from "@/components/ui/badge";
import { ChatBubble, WaScreen, PhoneFrame } from "@/components/landing/whatsapp";

/** HERO — primeira seção da landing do +Mulher. */
export function Hero() {
  return (
    <Section className="pt-10 sm:pt-16">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
          {/* Texto */}
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <Eyebrow icon={<MessageCircle className="size-3.5" />}>
                Saúde menstrual no WhatsApp
              </Eyebrow>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="font-display max-w-xl text-balance text-4xl font-bold leading-[1.04] sm:text-5xl lg:text-[3.4rem]">
                Nunca mais seja{" "}
                <span className="text-rose">surpreendida</span> pela menstruação.
              </h1>
            </Reveal>

            <Reveal delay={240}>
              <p className="max-w-lg text-pretty text-base text-muted-foreground sm:text-lg">
                O +Mulher prevê seu ciclo e te avisa no WhatsApp antes da próxima
                menstruação. Sem precisar abrir o app.
              </p>
            </Reveal>

            <Reveal delay={360}>
              <div className="flex flex-col items-start gap-4">
                <CtaButton size="lg">Começar agora</CtaButton>
                <Badge variant="soft">Feito para mulheres moçambicanas 🇲🇿</Badge>
              </div>
            </Reveal>
          </div>

          {/* Telemóvel com conversa */}
          <div className="relative w-full">
            <div className="glow-rose absolute inset-0 -z-10" />
            <Reveal delay={200}>
              <PhoneFrame>
                <WaScreen>
                  <Reveal delay={520}>
                    <ChatBubble direction="in" time="08:00">
                      Olá! 🌸 Sou o +Mulher. Vou te avisar por aqui antes da sua
                      próxima menstruação.
                    </ChatBubble>
                  </Reveal>
                  <Reveal delay={760}>
                    <ChatBubble direction="in" time="08:00">
                      Lembrete: sua menstruação está prevista para amanhã. 💜
                    </ChatBubble>
                  </Reveal>
                </WaScreen>
              </PhoneFrame>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

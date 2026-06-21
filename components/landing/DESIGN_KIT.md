# DESIGN KIT — Landing +Mulher (LEIA TUDO ANTES DE CODAR)

Você vai construir UMA seção da landing page do **+Mulher**. Leia este kit por
inteiro e componha com os componentes existentes. **Não** recrie primitivos,
**não** edite arquivos compartilhados, **não** mexa em `globals.css`/`layout.tsx`.

## Produto

+Mulher é um PWA de acompanhamento do ciclo menstrual para **mulheres
moçambicanas** (18–35, Android, usam WhatsApp todo dia). O gancho: ele **prevê o
ciclo e avisa no WhatsApp** antes da próxima menstruação, sem abrir o app. Alma
da página: _"Você não precisa lembrar. A gente lembra por você."_ Objetivo único:
levar ao **/cadastro**.

## Estética (o mais importante)

Dark-premium, limpa e moderna, mas **acolhedora e feminina** — nunca fria nem
corporativa. Fundo plum quase-preto, acento **rosa/coral**, violeta suave,
bastante respiro, cantos arredondados, microanimações sutis no scroll. Pense numa
marca de wellness premium, **não** num dashboard SaaS.

**EVITE o visual "landing feita por IA":** nada de três cartões idênticos com
gradiente, nada de tudo-centralizado e monótono, nada de espaçamento sem ritmo.
Varie o ritmo, use assimetria quando ajudar, e deixe os balões de WhatsApp serem
o centro emocional.

## Idioma e honestidade

Português de **Moçambique**. Use a copy EXATA que vier na sua tarefa (headlines,
bullets). **Não invente** números de download, avaliações, estrelas, logos de
imprensa, depoimentos, nem badges de App Store/Google Play. Sem seletor de idioma.
Sem plano gratuito / comparação de planos.

## Técnico

Next.js App Router + Tailwind v4 + shadcn. TypeScript **strict**: nada de `any`,
tipe props com `React.ReactNode`. **Server component por padrão**; só ponha
`"use client"` se precisar de estado/interatividade (ex.: menu mobile). Cada
componente é um **named export** com o nome exato pedido. Não crie `Landing.tsx`
nem `page.tsx` — a montagem é feita por quem te chamou.

## KIT — importe e componha (NÃO recrie)

```ts
// Layout / seção
import { Section, Container, SectionHeading, Eyebrow, CtaButton } from "@/components/landing/primitives";
// <Section id?>  → padding vertical da seção (py-20 sm:py-28). Um por seção. Não empilhe py gigante por fora.
// <Container>    → largura máxima + padding lateral. Conteúdo vai dentro.
// <SectionHeading eyebrow title subtitle align="center"|"left" icon={<Icon/>} />
//                 title/subtitle aceitam ReactNode. Use em TODO título de seção.
// <Eyebrow icon>…</Eyebrow>  → etiqueta pequena em maiúsculas.
// <CtaButton href="/cadastro" size="lg" variant?>Começar agora</CtaButton> → botão de conversão (vira <Link>).

import { Reveal } from "@/components/landing/Reveal";
// <Reveal delay={120}>…</Reveal> → fade+slide ao entrar na viewport. Escalone delays (0,120,240…).

import { Button } from "@/components/ui/button";
//   variant: default | secondary | outline | ghost | link ; size: sm | default | lg | icon ; asChild
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
//   variant: default | secondary | soft | outline
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
//   <Accordion type="single" collapsible> … <AccordionItem value="q1"><AccordionTrigger>…</AccordionTrigger><AccordionContent>…</AccordionContent></AccordionItem> …

// WhatsApp (use para mockups de conversa realistas)
import { ChatBubble, ChatThread, WaScreen, PhoneFrame, ChatHeader } from "@/components/landing/whatsapp";
// <ChatBubble direction="in"|"out" time="08:00">texto</ChatBubble>
// <ChatThread>…balões…</ChatThread>           → fundo de conversa
// <WaScreen>…balões…</WaScreen>               → cabeçalho "+Mulher" + conversa
// <PhoneFrame><WaScreen>…</WaScreen></PhoneFrame> → moldura de telemóvel

import { Logo } from "@/components/landing/Logo"; // <Logo/> ou <Logo iconOnly className="size-9"/>
import Link from "next/link";
// Ícones: import { Bell, Heart, ShieldCheck, ... } from "lucide-react";
```

### Ícones (lucide)
Use ícones finos e relevantes. Padrão de "chip" de ícone:
```tsx
<span className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-rose">
  <Icon className="size-6" />
</span>
```

## Cores — use SOMENTE estas classes (nunca hex cru, nunca azul-/slate-/emerald- fora dos componentes de WhatsApp)

- Base: `background`, `foreground`, `muted-foreground`, `card`, `secondary`, `border`
- Conversão: `bg-primary text-primary-foreground` (botão rosa)
- Acentos de marca: `text-rose`, `text-rose-soft`, `text-plum`, `text-violet-soft`
- Tints: `bg-primary/12`, `border-primary/20`, `text-rose/80`, `bg-secondary/50`, etc.
- Gradientes: `bg-gradient-to-br from-rose to-violet-soft` (ou `from-primary/15`)
- Classe utilitária `glow-rose` = brilho radial rosa (use atrás de heros/CTA num `<div className="glow-rose absolute …">`)

Títulos usam `font-display` (já aplicado por `SectionHeading`/`CardTitle`). Números
grandes/headlines: `font-display font-bold` com leading apertado.

## Regras finais

- **Mobile-first**: desenhe para 360px primeiro, depois `sm:`/`md:`/`lg:`. Grids viram 1 coluna no mobile.
- Todo CTA → `/cadastro` via `<CtaButton>` (texto padrão "Começar agora"; no preço, "Assinar agora").
- Envolva blocos-chave em `<Reveal>` com delays escalonados.
- Não importe nem crie nada fora do(s) seu(s) arquivo(s). Não modifique arquivos compartilhados.
- Âncoras de navegação: Como funciona = `id="como-funciona"`, Preço = `id="preco"`, Aprender = `id="aprender"`.

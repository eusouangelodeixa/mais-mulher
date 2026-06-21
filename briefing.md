# BRIEF — Landing Page do app +Mulher

## 1. Contexto do produto

+Mulher é um app de acompanhamento do ciclo menstrual feito exclusivamente para mulheres moçambicanas. A usuária registra sua menstruação, recebe previsões automáticas dos próximos ciclos e é avisada **via WhatsApp** antes da próxima menstruação, sem precisar abrir o app constantemente.

O diferencial central do produto, e o que deve ser o coração da landing, é a **integração com WhatsApp**. A mensagem-mãe da página é: *"Você não precisa lembrar. A gente lembra por você."*

Público: mulheres moçambicanas de 18 a 35 anos, Android, usam WhatsApp todo dia, querem prever a próxima menstruação.

## 2. Objetivo da landing

Único objetivo: levar a visitante ao **cadastro**. Toda a página converge para esse CTA. Não há loja de apps envolvida (ver nota técnica). A página deve educar (app novo, marca desconhecida), gerar identificação com o problema, apresentar o diferencial WhatsApp e remover objeções.

## 3. Stack e requisitos técnicos

- **É uma landing page web / PWA**, NÃO um app nativo. Construir em Next.js (App Router) + Tailwind. Componentes com shadcn/ui quando fizer sentido.
- **NÃO usar badges de App Store / Google Play em lugar nenhum.** Todos os CTAs apontam para a rota de cadastro web (`/cadastro`).
- Pagamento será via **M-Pesa e E-mola** (integração Lojou) — exibir esses selos na seção de preço; a integração de pagamento em si não é parte desta landing, só a comunicação visual.
- Lembretes são enviados via **Komunika** (WhatsApp) — isso é informação para a copy, não precisa integrar nada na landing.
- 100% responsiva, **mobile-first** (público é majoritariamente mobile Android). Testar em telas pequenas e conexões lentas: imagens otimizadas (avif/webp), peso da página enxuto.
- Português de Moçambique. Idioma único, sem seletor de idioma.
- SEO básico: title, meta description, og:image, favicon.

## 4. Direção de design

Estética dark-premium, limpa e moderna, mas **acolhedora e feminina** — não fria/corporativa. Sugestão de paleta: fundo escuro profundo com um tom de acento quente (rosa/coral ou roxo suave) para CTAs e destaques. Tipografia: Plus Jakarta Sans ou Sora. Bastante respiro entre seções, cantos arredondados, microanimações sutis no scroll. Os mockups de WhatsApp devem parecer conversas reais (balões verdes/cinza no estilo do WhatsApp).

## 5. Estrutura da página, seção a seção

### Seção 0 — Banner de topo (fixo)
Faixa fina no topo com oferta de lançamento. CTA curto.
Texto: **"Lançamento 🌸 Primeiro mês com desconto — comece já"** + botão "Começar".

### Seção 1 — Header / Navegação
Logo +Mulher à esquerda. Menu enxuto: Como funciona · Preço · Aprender. À direita, botão de destaque **"Começar agora"**. No mobile, vira menu hambúrguer. Sem dropdowns.

### Seção 2 — Hero
- **Headline:** "Nunca mais seja surpreendida pela menstruação."
- **Subheadline:** "O +Mulher prevê seu ciclo e te avisa no WhatsApp antes da próxima menstruação. Sem precisar abrir o app."
- **CTA principal:** "Começar agora" (→ /cadastro)
- **Visual do hero:** em vez de print do app, mostrar um **balão de conversa do WhatsApp** com um lembrete real (ex: "Lembrete: sua menstruação está prevista para amanhã. 💜"). O diferencial entra na cara já no topo.
- Pequeno selo de confiança abaixo do CTA: "Feito para mulheres moçambicanas 🇲🇿". (NÃO inventar números de download ou avaliações.)

### Seção 3 — O problema
Título: **"Você reconhece isso?"**
Quatro cartões curtos com ícone:
1. Menstruação que chega de surpresa, na pior hora.
2. Ansiedade toda vez que atrasa.
3. Não entender direito o próprio ciclo.
4. Nenhum lembrete que realmente funcione.
Frase de fechamento abaixo dos cartões: "O +Mulher resolve isso de um jeito simples."

### Seção 4 — Como funciona (3 passos)
Título: **"Simples assim"**
1. **Registre** — Informe sua última menstruação. Leva menos de 2 minutos.
2. **Receba a previsão** — Veja a data da próxima menstruação e do seu período fértil.
3. **Seja avisada** — Receba lembretes no WhatsApp, sem abrir o app.
Cada passo com número grande, ícone e uma linha de texto. CTA ao final: "Começar agora".

### Seção 5 — O diferencial WhatsApp (seção-âncora, a mais importante)
Título: **"Você não precisa lembrar. A gente lembra por você."**
Subtítulo: "Receba lembretes no WhatsApp, onde você já está todo dia."
Mostrar **4 balões de WhatsApp** com os lembretes reais:
- *"Olá! Sua próxima menstruação está prevista para os próximos dias. Prepare-se com antecedência. 🌸"* (3 dias antes)
- *"Lembrete: sua menstruação está prevista para amanhã. 💜"* (1 dia antes)
- *"Hoje é a data prevista para o início do seu ciclo menstrual."* (início previsto)
- *"Seu período fértil está se aproximando."* (período fértil)
Layout sugerido: conversa de WhatsApp estilizada, balões aparecendo em sequência no scroll.

### Seção 6 — O que você acompanha (funcionalidades visuais)
Título: **"Tudo o que importa, num só lugar"**
Mostrar mockup/ilustração do dashboard e listar de forma enxuta:
- Próxima menstruação prevista e dias restantes
- Dia atual do ciclo
- Próximo período fértil
- Histórico completo dos seus ciclos
- Conteúdo educativo sobre saúde menstrual

### Seção 7 — Confiança local (substitui a seção de "ciência" de apps grandes)
Título: **"Pensado para você"**
Três pontos, com ícones:
- **Em português, para moçambicanas.** Feito para a nossa realidade.
- **Pague com M-Pesa ou E-mola.** Simples, do jeito que você já paga. (exibir os selos)
- **Seus dados são privados.** Suas informações são suas. (IMPORTANTE: só escrever isto se for verdade na prática — não copiar promessas que o produto não cumpre.)

### Seção 8 — Por que criamos o +Mulher (missão)
Bloco curto de texto contando a motivação: milhares de mulheres moçambicanas não têm uma forma simples de acompanhar o ciclo. Criamos o +Mulher para mudar isso. (Esta seção substitui depoimentos enquanto o produto ainda não tem usuárias reais. Quando houver beta-testers reais, trocar por depoimentos verdadeiros.)

### Seção 9 — Preço
Título: **"Um plano. Tudo incluído."**
Card único:
- **67 MT / mês**
- Lista de benefícios:
  - Registro ilimitado de ciclos
  - Histórico completo
  - Previsões automáticas
  - Lembretes via WhatsApp
  - Conteúdo educativo
- Selo: "Pague com M-Pesa ou E-mola"
- CTA: **"Assinar agora"** (→ /cadastro)
NÃO fazer comparação grátis vs premium. É plano único.

### Seção 10 — Perguntas frequentes (FAQ)
Título: **"Perguntas frequentes"**
Acordeão com, no mínimo:
- **Preciso baixar algum app?** — Não. O +Mulher funciona direto no seu navegador.
- **Como faço o pagamento?** — Por M-Pesa ou E-mola, de forma simples.
- **Os meus dados são privados?** — Sim. (ajustar conforme a política real do produto)
- **E se eu trocar de telemóvel?** — Sua conta e seu histórico continuam salvos.
- **Como cancelo?** — A qualquer momento, sem complicação.
- **Os lembretes chegam mesmo no WhatsApp?** — Sim, é o coração do +Mulher.

### Seção 11 — CTA final
Faixa de fechamento com fundo de destaque.
Título: **"Comece a entender o seu ciclo hoje."**
CTA grande: "Começar agora".

### Seção 12 — Footer
Logo +Mulher. Links: Sobre · Privacidade · Termos · Contato (WhatsApp). Ícones de redes sociais. Copyright. Enxuto.

## 6. CTAs (resumo)
Todos os botões de ação levam para **/cadastro**, com exceção de links de navegação âncora (Como funciona, Preço, Aprender) que rolam para as respectivas seções. Texto padrão dos CTAs: "Começar agora" (ou "Assinar agora" no card de preço).

## 7. O que NÃO incluir
- Badges de App Store / Google Play.
- Números de download, avaliações ou estrelas inventados.
- Logos de imprensa ou parcerias com universidades.
- Depoimentos falsos.
- Seletor de idioma.
- Plano gratuito / comparação de planos.

## 8. Entregáveis
- Landing page responsiva em Next.js + Tailwind.
- Código organizado por componentes (um componente por seção).
- Imagens otimizadas.
- Pronta para deploy.
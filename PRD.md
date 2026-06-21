# PRD — +Mulher

## Visão Geral

+Mulher é uma plataforma simples de acompanhamento do ciclo menstrual voltada para mulheres moçambicanas. O objetivo é permitir que a usuária registre sua menstruação, receba previsões automáticas dos próximos ciclos e seja notificada via WhatsApp antes da próxima menstruação.

O diferencial principal é a integração com WhatsApp, eliminando a necessidade de abrir constantemente o aplicativo. (usando Komunika)

---

# Problema

Milhares de mulheres moçambicanas não possuem uma forma simples de acompanhar seus ciclos menstruais.

Consequências:

- Menstruação inesperada.
- Ansiedade relacionada a atrasos.
- Falta de compreensão sobre o próprio ciclo.
- Ausência de lembretes úteis e personalizados.

---

# Objetivo do Produto

Permitir que qualquer mulher registre seus ciclos em menos de 2 minutos e receba lembretes automáticos pelo WhatsApp sobre:

- Próxima menstruação.
- Período fértil.
- Atrasos significativos.

---

# Público-Alvo

Mulheres moçambicanas de 18 a 35 anos.

Características:

- Possuem smartphone Android.
- Utilizam WhatsApp diariamente.
- Desejam prever a próxima menstruação.
- Buscam mais controle sobre sua saúde menstrual.

---

# Modelo de Negócio

Plano Único

Preço: 47 MT/mês

Período de teste gratuito: 7 dias (acesso completo, sem cobrança).

Inclui:

- Registro ilimitado de ciclos.
- Histórico completo.
- Previsões automáticas.
- Lembretes via WhatsApp.
- Conteúdo educativo básico.

O que acontece quando a assinatura expira:

- Os lembretes via WhatsApp são pausados.
- O app entra em modo limitado: a usuária ainda vê seu histórico, mas não recebe novas previsões nem lembretes até renovar.
- Renovação é feita pagando novamente via M-Pesa ou E-mola (cobrança manual mensal no MVP).

---

# MVP

## Funcionalidade 1: Cadastro

Usuária cria conta utilizando:

- Nome
- Número de WhatsApp
- Senha

O número de WhatsApp é validado por um código enviado por WhatsApp (verificação em 4 dígitos). Isso garante que os lembretes cheguem ao número correto e permite recuperar a conta depois.

---

## Funcionalidade 2: Configuração Inicial

Ao entrar pela primeira vez:

Pergunta 1:

Quando começou sua última menstruação?

Pergunta 2:

Quantos dias normalmente dura seu ciclo?

Exemplo:

28 dias

Pergunta 3:

Quantos dias costuma durar sua menstruação?

Exemplo:

5 dias

Esses valores são usados como base inicial. Conforme a usuária registra novos ciclos, a duração média do ciclo é recalculada automaticamente (ver Regras de Negócio).

---

## Funcionalidade 3: Dashboard

Mostrar:

- Próxima menstruação prevista
- Dias restantes
- Dia atual do ciclo
- Próxima janela fértil

---

## Funcionalidade 4: Registro de Menstruação

Botão:

"Iniciar Menstruação"

Ao clicar:

- Registra a data atual como início do ciclo
- Atualiza previsões futuras

Botão:

"Encerrar Menstruação"

Ao clicar:

- Registra a data de término
- A duração da menstruação é guardada no histórico

---

## Funcionalidade 5: Histórico

Lista contendo:

- Data de início
- Data de término
- Duração do ciclo

---

## Funcionalidade 6: Lembretes WhatsApp

Todos os lembretes são enviados pela manhã, por volta das 08:00, no horário de Moçambique (CAT / UTC+2).

### 3 dias antes

Mensagem:

"Olá! Sua próxima menstruação está prevista para os próximos dias. Prepare-se com antecedência. 🌸"

---

### 1 dia antes

Mensagem:

"Lembrete: sua menstruação está prevista para amanhã. 💜"

---

### Início previsto

Mensagem:

"Hoje é a data prevista para o início do seu ciclo menstrual."

---

### Período fértil

Mensagem:

"Sua janela fértil está se aproximando."

Enviada no início da janela fértil estimada.

---

### Atraso

Enviada 3 dias após a data prevista, caso a usuária ainda não tenha registrado o início da menstruação.

Mensagem:

"Sua menstruação está com alguns dias de atraso. Atrasos ocasionais são normais. Se persistir, considere falar com um profissional de saúde. 💜"

---

## Funcionalidade 7: Conteúdo Educativo

Biblioteca simples com artigos:

- O que é ciclo menstrual
- O que é período fértil
- Como identificar irregularidades
- Quando procurar um ginecologista

---

# Regras de Negócio

## Duração Média do Ciclo

- Antes do primeiro ciclo registrado: usa o valor informado no onboarding.
- A partir do segundo ciclo registrado: usa a média dos últimos ciclos reais (intervalo entre datas de início).

## Cálculo do Próximo Ciclo

Próxima menstruação:

Última data de início registrada + duração média do ciclo

Exemplo:

Última menstruação:

01/06

Ciclo:

28 dias

Próxima previsão:

29/06

---

## Janela Fértil

A ovulação é estimada para 14 dias antes da próxima menstruação prevista.

A janela fértil é o intervalo de cerca de 6 dias que termina 1 dia após a ovulação estimada:

- Início: ovulação estimada − 5 dias
- Fim: ovulação estimada + 1 dia

Exemplo (próxima menstruação prevista para 29/06):

- Ovulação estimada: 15/06
- Janela fértil: 10/06 a 16/06

Observação: as previsões são estimativas baseadas em médias e não substituem orientação médica.

---

# Privacidade

Os dados do ciclo são dados pessoais sensíveis de saúde.

- A usuária consente com o uso dos dados para gerar previsões e lembretes no momento do cadastro.
- As mensagens de WhatsApp são escritas de forma discreta, sem expor detalhes íntimos.
- Os dados não são compartilhados com terceiros.

---

# Telas Necessárias

1. Login
2. Cadastro (com verificação do número via WhatsApp)
3. Onboarding Inicial
4. Dashboard
5. Registrar Menstruação
6. Histórico
7. Conteúdo Educativo
8. Configurações
9. Assinatura

---

# Métricas de Sucesso

- Cadastro concluído
- Assinatura ativa
- Registro mensal de ciclo
- Taxa de abertura das mensagens WhatsApp
- Retenção após 30 dias

---

# Stack Recomendada

Frontend:

- Next.js

Backend:

- Prisma

Banco:

- PostgreSQL (Supabase)

Pagamentos:

- Lojou (M-Pesa / E-mola) → https://docs.lojou.app 

Mensagens:

- Komunika (documentação do Komunika → https://docs.komunika.site)

Agendamento dos lembretes:

- Tarefa diária (cron) que verifica quais usuárias devem receber lembretes no dia e dispara as mensagens via Komunika.

---

# Escopo Fora do MVP

Não desenvolver inicialmente:

- Chat com médicos
- Inteligência artificial
- Comunidade
- Telemedicina
- Marketplace
- Controle de gravidez
- Controle de medicamentos
- Controle de sintomas avançados
- Aplicativo mobile nativo
- Renovação automática de assinatura

Foco absoluto: registrar ciclo + prever ciclo + enviar lembretes via WhatsApp.

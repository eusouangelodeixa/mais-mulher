# +Mulher

Acompanhamento do ciclo menstrual para mulheres moçambicanas. Registre sua
menstruação, receba previsões automáticas dos próximos ciclos e seja avisada
**pelo WhatsApp** antes da próxima menstruação — sem precisar abrir o app.

> _"Você não precisa lembrar. A gente lembra por você."_

## Stack

- **Next.js 16** (App Router) + **React 19** + **Tailwind CSS v4**
- **shadcn/ui** + **lucide-react** (landing page dark-premium)
- **Prisma** + **PostgreSQL**
- **jose** (sessão JWT) · **bcryptjs** (senhas)
- Mensagens via **Komunika** (WhatsApp) · Pagamentos via **Lojou** (M-Pesa / E-mola)

## Desenvolvimento

```bash
npm install
cp .env.example .env      # preencha as variáveis
npx prisma migrate deploy # aplica o schema
npm run db:seed           # opcional: dados de exemplo
npm run dev               # http://localhost:3000
```

Banco local: use o `docker-compose.yml` (Postgres na porta 5433) ou um cluster
Postgres próprio. Ajuste `DATABASE_URL` / `DIRECT_URL` no `.env`.

## Scripts

| Comando            | Descrição                                  |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Servidor de desenvolvimento                |
| `npm run build`    | Build de produção                          |
| `npm test`         | Testes da lógica de ciclo                   |
| `npm run cron`     | Dispara os lembretes do dia (WhatsApp)     |
| `npm run db:seed`  | Popula o banco com dados de exemplo        |

## Estrutura

- `app/` — rotas (landing pública em `/`, app autenticado, APIs de cron/webhook)
- `components/landing/` — seções da landing page
- `components/ui/` — primitivos shadcn
- `lib/` — lógica de ciclo, auth, integrações (Komunika, Lojou)
- `prisma/` — schema e migrações

## Variáveis de ambiente

Veja [`.env.example`](.env.example). Nunca commite o `.env` real.

---

Feito em Moçambique. 🇲🇿

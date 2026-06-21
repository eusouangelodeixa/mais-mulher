import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { getActivationLead } from "@/lib/leads";
import { ActivateForm } from "./ActivateForm";

export default async function AtivarPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const lead = token ? await getActivationLead(token) : null;
  const alreadyActivated = !!lead?.activatedAt && !!lead.userId;

  return (
    <div className="landing flex min-h-dvh flex-col bg-background text-foreground">
      <div className="glow-rose pointer-events-none absolute inset-x-0 top-0 -z-0 h-80" />
      <header className="relative z-10 px-5 py-5 sm:px-8">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-2xl shadow-black/40 sm:p-8">
          {!lead ? (
            <div className="text-center">
              <XCircle className="mx-auto size-12 text-rose" />
              <h1 className="font-display mt-4 text-2xl font-bold">
                Link inválido
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Este link de ativação não é válido ou expirou. Se você já pagou,
                verifique a última mensagem que enviamos no WhatsApp.
              </p>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/comecar">Começar agora</Link>
              </Button>
            </div>
          ) : alreadyActivated ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto size-12 text-rose" />
              <h1 className="font-display mt-4 text-2xl font-bold">
                Acesso já ativado
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Esta conta já foi criada. É só entrar com o seu número e senha.
              </p>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-soft">
                Pagamento confirmado 💜
              </p>
              <h1 className="font-display mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                Ative o seu acesso
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Crie uma senha para entrar no +Mulher sempre que quiser.
              </p>
              <ActivateForm token={token!} name={lead.name} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

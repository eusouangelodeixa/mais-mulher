import { Container, CtaButton } from "@/components/landing/primitives";

/**
 * Seção 0 — faixa fina de lançamento no topo da página.
 * Não é sticky: rola junto com o conteúdo (quem fica fixo é o SiteHeader).
 */
export function TopBanner() {
  return (
    <div className="border-b border-border bg-gradient-to-r from-primary/15 via-secondary/40 to-violet-soft/15 py-2.5">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs sm:text-sm">
          <p className="text-muted-foreground">
            Lançamento 🌸 Primeiro mês com desconto — comece já
          </p>
          <CtaButton size="sm">Começar</CtaButton>
        </div>
      </Container>
    </div>
  );
}

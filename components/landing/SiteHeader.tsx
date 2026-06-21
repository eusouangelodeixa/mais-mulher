"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import { Container, CtaButton } from "@/components/landing/primitives";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: ReadonlyArray<NavLink> = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preço", href: "#preco" },
  { label: "Aprender", href: "#aprender" },
];

/** Cabeçalho fixo da landing, com navegação desktop e menu mobile. */
export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <CtaButton size="default">Começar agora</CtaButton>
          </nav>

          {/* Botão hambúrguer mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      {/* Painel mobile */}
      {open ? (
        <div className="flex flex-col gap-2 border-b border-border bg-background p-5 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-xl px-2 py-3 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <CtaButton size="lg" className="mt-2 w-full">
            Começar agora
          </CtaButton>
        </div>
      ) : null}
    </header>
  );
}

import * as React from "react";
import Link from "next/link";

import { Container } from "@/components/landing/primitives";
import { Logo } from "@/components/landing/Logo";

/** Glifos de marca (lucide descontinuou ícones de marca). */
function Instagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Whatsapp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.46 0-9.9 4.43-9.9 9.9 0 1.74.46 3.44 1.32 4.94L2 22l5.3-1.39a9.86 9.86 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.43 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.18.84 5.71 2.37a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.06.8.82-2.99-.19-.31a8.04 8.04 0 0 1-1.24-4.29c0-4.46 3.63-8.09 8.1-8.09Zm-4.64 4.6c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.72 2.64 4.22 3.7.59.25 1.05.4 1.41.52.59.18 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.16.25-.63.8-.78.96-.14.17-.28.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42l-.47-.01Z" />
    </svg>
  );
}

const navLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Sobre", href: "#" },
  { label: "Privacidade", href: "#" },
  { label: "Termos", href: "#" },
  { label: "Contato", href: "#" },
];

/** RODAPÉ — enxuto, com logo, tagline, links e redes. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Acompanhe seu ciclo. A gente avisa no WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="#"
                aria-label="Instagram"
                className="text-muted-foreground transition-colors hover:text-rose"
              >
                <Instagram className="size-5" />
              </Link>
              <Link
                href="#"
                aria-label="WhatsApp"
                className="text-muted-foreground transition-colors hover:text-rose"
              >
                <Whatsapp className="size-5" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © 2026 +Mulher. Feito em Moçambique. 🇲🇿
        </p>
      </Container>
    </footer>
  );
}

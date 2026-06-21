"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Início", icon: "🏠" },
  { href: "/registrar", label: "Registrar", icon: "🩸" },
  { href: "/historico", label: "Histórico", icon: "📅" },
  { href: "/conteudo", label: "Conteúdo", icon: "📖" },
  { href: "/configuracoes", label: "Conta", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-brand-100 bg-white">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                active ? "text-brand-700" : "text-gray-500"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className={active ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

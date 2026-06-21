import * as React from "react";
import { ArrowLeft, Phone, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

/** Ticks duplos azuis (lido) do WhatsApp. */
function ReadTicks() {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-4 text-[#53bdeb]" aria-hidden>
      <path
        d="M1 6.6 4 9.6l6.2-7M6.8 9 12.6 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Um balão de mensagem no estilo do WhatsApp (tema escuro). */
export function ChatBubble({
  children,
  time = "08:00",
  direction = "in",
  className,
}: {
  children: React.ReactNode;
  time?: string;
  direction?: "in" | "out";
  className?: string;
}) {
  const out = direction === "out";
  return (
    <div className={cn("flex w-full", out ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[82%] rounded-2xl px-3 pb-5 pt-2 text-[0.93rem] leading-snug text-wa-text shadow-sm shadow-black/20",
          out ? "rounded-tr-sm bg-wa-out" : "rounded-tl-sm bg-wa-in",
          className,
        )}
      >
        <p className="whitespace-pre-line text-pretty">{children}</p>
        <span className="absolute bottom-1.5 right-2.5 flex items-center gap-1 text-[0.62rem] text-wa-text/55">
          {time}
          {out ? <ReadTicks /> : null}
        </span>
      </div>
    </div>
  );
}

/** Fundo de conversa do WhatsApp que agrupa os balões. */
export function ChatThread({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("wa-chat flex flex-col gap-2.5 p-4", className)}>
      {children}
    </div>
  );
}

/** Barra de topo da conversa com o contato "+Mulher". */
export function ChatHeader() {
  return (
    <div className="flex items-center gap-3 bg-[#1f2c34] px-4 py-3 text-wa-text">
      <ArrowLeft className="size-5 shrink-0 text-wa-text/70" />
      <Logo iconOnly className="size-9 shrink-0" />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold">+Mulher</p>
        <p className="truncate text-[0.7rem] text-wa-text/55">online</p>
      </div>
      <Video className="size-5 text-wa-text/70" />
      <Phone className="size-[1.1rem] text-wa-text/70" />
    </div>
  );
}

/** Tela completa do WhatsApp (cabeçalho + conversa). */
export function WaScreen({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col bg-wa-bg", className)}>
      <ChatHeader />
      <ChatThread className="flex-1">{children}</ChatThread>
    </div>
  );
}

/** Moldura de telemóvel para envolver uma tela (ex.: conversa do WhatsApp). */
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[300px]", className)}>
      <div className="rounded-[2.7rem] border border-white/10 bg-[#080b0e] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-wa-bg">
          <div className="absolute left-1/2 top-2.5 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-black/85" />
          {children}
        </div>
      </div>
    </div>
  );
}

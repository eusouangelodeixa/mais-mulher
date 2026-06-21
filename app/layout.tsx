import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "+Mulher — Nunca mais seja surpreendida pela menstruação",
  description:
    "O +Mulher prevê seu ciclo e te avisa no WhatsApp antes da próxima menstruação. Feito para mulheres moçambicanas.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#120a10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={`${jakarta.variable} ${sora.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

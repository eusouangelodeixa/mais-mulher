import Link from "next/link";

export function LimitedModeBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="font-semibold text-amber-900">Modo limitado</p>
      <p className="mt-1 text-sm text-amber-800">
        Sua assinatura expirou. As previsões e os lembretes pelo WhatsApp estão
        pausados. Seu histórico continua disponível.
      </p>
      <Link
        href="/assinatura"
        className="mt-3 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Renovar assinatura
      </Link>
    </div>
  );
}

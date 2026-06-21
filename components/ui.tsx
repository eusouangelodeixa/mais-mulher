import type { ComponentProps, ReactNode } from "react";

export const buttonClasses = {
  base: "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary:
    "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50",
  ghost: "text-brand-700 hover:bg-brand-50",
};

export function primaryBtn(extra = ""): string {
  return `${buttonClasses.base} ${buttonClasses.primary} ${extra}`;
}
export function secondaryBtn(extra = ""): string {
  return `${buttonClasses.base} ${buttonClasses.secondary} ${extra}`;
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-brand-100 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${props.className ?? ""}`}
    />
  );
}

export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}

export function Banner({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning";
  children: ReactNode;
}) {
  const tones = {
    info: "bg-accent-500/10 text-accent-600 border-accent-500/20",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

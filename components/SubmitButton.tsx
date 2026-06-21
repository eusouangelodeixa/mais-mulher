"use client";

import { useFormStatus } from "react-dom";
import { primaryBtn, secondaryBtn } from "./ui";

export function SubmitButton({
  children,
  pendingLabel = "Aguarde...",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  const cls = variant === "primary" ? primaryBtn() : secondaryBtn();
  return (
    <button type="submit" disabled={pending} className={cls}>
      {pending ? pendingLabel : children}
    </button>
  );
}

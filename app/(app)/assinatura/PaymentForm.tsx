"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { startPayment } from "./actions";

export function PaymentForm() {
  const [state, action] = useActionState(startPayment, null);
  return (
    <form action={action} className="space-y-4">
      <Field label="Forma de pagamento" htmlFor="method">
        <select
          id="method"
          name="method"
          className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3"
        >
          <option value="MPESA">M-Pesa</option>
          <option value="EMOLA">E-mola</option>
        </select>
      </Field>
      {state?.notice ? (
        <p className="text-sm text-green-700">{state.notice}</p>
      ) : null}
      {state?.error ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}
      <SubmitButton pendingLabel="Processando...">Pagar 47 MT</SubmitButton>
    </form>
  );
}

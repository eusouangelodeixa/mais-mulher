"use client";

import { useActionState } from "react";
import { Field, Input, ErrorText } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { saveOnboarding } from "./actions";

export function OnboardingForm() {
  const [state, action] = useActionState(saveOnboarding, null);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Configuração inicial</h1>
        <p className="text-gray-600">Vamos personalizar suas previsões.</p>
      </div>

      <form action={action} className="space-y-4">
        <Field
          label="Quando começou sua última menstruação?"
          htmlFor="lastPeriodStart"
        >
          <Input id="lastPeriodStart" name="lastPeriodStart" type="date" required />
        </Field>

        <Field
          label="Quantos dias normalmente dura seu ciclo?"
          htmlFor="cycleLength"
          hint="Exemplo: 28 dias"
        >
          <Input
            id="cycleLength"
            name="cycleLength"
            type="number"
            inputMode="numeric"
            defaultValue={28}
            min={15}
            max={60}
            required
          />
        </Field>

        <Field
          label="Quantos dias costuma durar sua menstruação?"
          htmlFor="periodLength"
          hint="Exemplo: 5 dias"
        >
          <Input
            id="periodLength"
            name="periodLength"
            type="number"
            inputMode="numeric"
            defaultValue={5}
            min={1}
            max={15}
            required
          />
        </Field>

        <ErrorText>{state?.error}</ErrorText>
        <SubmitButton pendingLabel="Salvando...">Concluir</SubmitButton>
      </form>
    </div>
  );
}

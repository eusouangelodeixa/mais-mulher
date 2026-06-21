"use client";

import { useActionState } from "react";
import { Field, Input, ErrorText } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { updateSettings } from "./actions";

type SettingsFormProps = {
  name: string;
  cycleLength: number;
  periodLength: number;
};

export function SettingsForm({ name, cycleLength, periodLength }: SettingsFormProps) {
  const [state, action] = useActionState(updateSettings, null);

  return (
    <form action={action} className="space-y-4">
      <Field label="Nome" htmlFor="name">
        <Input id="name" name="name" defaultValue={name} required />
      </Field>
      <Field label="Duração média do ciclo (dias)" htmlFor="cycleLength">
        <Input
          id="cycleLength"
          name="cycleLength"
          type="number"
          defaultValue={cycleLength}
          min={15}
          max={60}
          required
        />
      </Field>
      <Field label="Duração média da menstruação (dias)" htmlFor="periodLength">
        <Input
          id="periodLength"
          name="periodLength"
          type="number"
          defaultValue={periodLength}
          min={1}
          max={15}
          required
        />
      </Field>
      {state?.notice ? <p className="text-sm text-green-700">{state.notice}</p> : null}
      <ErrorText>{state?.error}</ErrorText>
      <SubmitButton pendingLabel="Salvando...">Salvar</SubmitButton>
    </form>
  );
}

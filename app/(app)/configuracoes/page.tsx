import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { Card, secondaryBtn } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { SettingsForm } from "./SettingsForm";
import { logout } from "./actions";

export default async function ConfiguracoesPage() {
  const user = await requireUser();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>

      <Card>
        <p className="text-sm text-gray-500">Número de WhatsApp</p>
        <p className="font-medium">{user.whatsapp}</p>
      </Card>

      <Card>
        <SettingsForm
          name={user.name}
          cycleLength={user.baseCycleLength ?? 28}
          periodLength={user.basePeriodLength ?? 5}
        />
      </Card>

      <Card>
        <Link href="/assinatura" className={secondaryBtn()}>
          Gerenciar assinatura
        </Link>
      </Card>

      <form action={logout}>
        <SubmitButton variant="secondary" pendingLabel="Saindo...">
          Sair da conta
        </SubmitButton>
      </form>
    </div>
  );
}

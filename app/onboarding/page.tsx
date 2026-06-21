import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const user = await requireUser({ allowOnboarding: true });
  if (user.onboardingDone) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      <OnboardingForm />
    </div>
  );
}

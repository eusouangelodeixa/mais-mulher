import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Landing } from "@/components/landing/Landing";

export default async function HomePage() {
  const user = await getCurrentUser();

  // Usuária logada vai direto para o app; visitante vê a landing.
  if (user) {
    redirect(user.onboardingDone ? "/dashboard" : "/onboarding");
  }

  return <Landing />;
}

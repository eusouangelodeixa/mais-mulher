import { redirect } from "next/navigation";
import { VerifyForm } from "./VerifyForm";

export default async function VerificarPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const { w } = await searchParams;
  if (!w) redirect("/cadastro");
  return <VerifyForm whatsapp={w} />;
}

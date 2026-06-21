import { redirect } from "next/navigation";
import { RedefinirForm } from "./RedefinirForm";

export default async function RedefinirPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const { w } = await searchParams;
  if (!w) redirect("/recuperar");
  return <RedefinirForm whatsapp={w} />;
}

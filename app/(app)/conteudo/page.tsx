import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { articles } from "@/lib/content";
import { Card } from "@/components/ui";

export default async function ConteudoPage() {
  await requireUser();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Conteúdo educativo</h1>
      <p className="text-sm text-gray-600">
        Aprenda mais sobre seu corpo e seu ciclo.
      </p>

      <div className="space-y-3">
        {articles.map((a) => (
          <Link key={a.slug} href={`/conteudo/${a.slug}`} className="block">
            <Card>
              <p className="font-semibold text-brand-700">{a.title}</p>
              <p className="mt-1 text-sm text-gray-600">{a.summary}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

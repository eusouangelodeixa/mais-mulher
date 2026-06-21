import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getArticle } from "@/lib/content";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireUser();
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article className="space-y-4">
      <Link href="/conteudo" className="text-sm font-medium text-brand-700">
        ← Voltar
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
      {article.body.map((paragraph, i) => (
        <p key={i} className="text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </article>
  );
}

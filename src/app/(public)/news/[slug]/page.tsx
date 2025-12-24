import { getNewsBySlug, getNewsSlugs } from '../../../../lib/content/news';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = getNewsBySlug(slug);
  if (!article) return notFound();

  return (
    <article className="max-w-3xl">
      <div className="text-sm text-slate-500">
        {article.date}
        {article.category ? ` • ${article.category}` : ''}
      </div>

      <h1 className="text-4xl font-bold text-slate-900 mt-2">
        {article.title}
      </h1>

      {article.excerpt ? (
        <p className="mt-4 text-lg text-slate-600">{article.excerpt}</p>
      ) : null}

      <div className="prose prose-slate mt-8 whitespace-pre-wrap">
        {article.content}
      </div>
    </article>
  );
}

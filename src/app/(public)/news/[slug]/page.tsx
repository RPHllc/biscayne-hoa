import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllNews, getNewsBySlug } from '@/lib/content/news';

export const runtime = 'edge';

export function generateStaticParams() {
  return getAllNews().map((item) => ({ slug: item.slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/news"
          className="text-teal-700 font-medium hover:underline"
        >
          ← Back to News
        </Link>
        <div className="mt-4 text-xs font-semibold text-teal-700 uppercase">
          {item.category}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mt-2">{item.title}</h1>
        <div className="text-sm text-slate-500 mt-2">{item.date}</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="space-y-4 text-slate-700 leading-relaxed">
          {item.body.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

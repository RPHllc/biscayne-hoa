import Link from 'next/link';
import { getAllNews } from '@/lib/content/news';

export default function NewsIndexPage() {
  const items = getAllNews();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Community -News</h2>

      {items.length === 0 ? (
        <p className="text-slate-600">No announcements yet.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.slug}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-teal-300 transition"
            >
              <div className="text-xs font-semibold text-teal-700 uppercase">
                {item.category}
              </div>

              <h3 className="text-xl font-bold mt-1">
                <Link href={`/news/${item.slug}`} className="hover:underline">
                  {item.title}
                </Link>
              </h3>

              <p className="text-slate-600 mt-2">
                {item.excerpt ?? `${item.content.slice(0, 140)}…`}
              </p>

              <div className="text-xs text-slate-400 mt-3">{item.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

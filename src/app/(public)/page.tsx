import Link from 'next/link';
import { getAnnouncements } from '@/lib/content/announcements';
import { getEvents } from '@/lib/content/events';
import { getAllNews } from '@/lib/content/news';

export default function HomePage() {
  const announcements = getAnnouncements().slice(0, 2);
  const events = getEvents().slice(0, 3);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const latest = getAllNews()
    .filter((item) => new Date(item.date) >= thirtyDaysAgo)
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-slate-900 text-white p-10">
        <h2 className="text-4xl font-bold">Biscayne Point HOA</h2>
        <p className="text-slate-200 mt-3 max-w-2xl">
          Community updates, documents, and payments — in one place.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            className="bg-teal-700 hover:bg-teal-800 px-5 py-2 rounded-lg font-medium"
            href="/pay"
          >
            Pay Dues
          </Link>
          <Link
            className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg font-medium"
            href="/portal"
          >
            Resident Portal
          </Link>
        </div>
      </section>

      {latest.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Latest News</h2>
            <Link
              href="/news"
              className="text-teal-700 font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latest.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-sm transition"
              >
                <div className="text-xs font-semibold text-teal-700 uppercase">
                  {item.category}
                </div>
                <div className="mt-2 font-bold text-slate-900">
                  {item.title}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {item.excerpt ?? `${item.content.slice(0, 140)}…`}
                </div>
                <div className="mt-3 text-xs text-slate-400">{item.date}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Community Updates</h3>
            <Link
              className="text-teal-700 font-medium hover:underline"
              href="/news"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {announcements.map((a) => (
              <div
                key={a.href}
                className="p-4 rounded-lg border border-slate-200 hover:border-teal-200 transition"
              >
                <div className="text-xs font-semibold text-teal-700 uppercase">
                  {a.category}
                </div>
                <div className="font-bold mt-1">{a.title}</div>
                <div className="text-sm text-slate-600 mt-1">{a.summary}</div>
                <div className="text-xs text-slate-400 mt-2">{a.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold">Upcoming Events</h3>
          <div className="mt-4 space-y-3">
            {events.length === 0 ? (
              <div className="text-slate-500">No events posted yet.</div>
            ) : (
              events.map((e, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-200"
                >
                  <div className="font-bold">{e.title}</div>
                  <div className="text-sm text-slate-600 mt-1">
                    {new Date(e.start).toLocaleString()}{' '}
                    {e.location ? `• ${e.location}` : ''}
                  </div>
                  {e.description ? (
                    <div className="text-sm text-slate-500 mt-2">
                      {e.description}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

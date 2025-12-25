import Link from 'next/link';
import { getBoardContent } from '@/lib/content/board';

export default function BoardPage() {
  const { officers, membersAtLarge, committees } = getBoardContent();

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Board & Committees</h2>
        <p className="text-slate-600">
          Current leadership and committees supporting the Biscayne Point HOA.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-bold">Officers</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {officers.map((officer) => (
            <div
              key={officer.name}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <div className="text-lg font-semibold text-slate-900">
                {officer.name}
              </div>
              <div className="text-sm text-slate-600">{officer.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-bold">Members at Large</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {membersAtLarge.map((member) => (
            <div
              key={member.name}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <div className="text-lg font-semibold text-slate-900">
                {member.name}
              </div>
              {member.note ? (
                <div className="text-sm text-slate-500">{member.note}</div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-bold">Committees</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {committees.map((committee) => (
            <div
              key={committee.name}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <div className="text-lg font-semibold text-slate-900">
                {committee.name}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {committee.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">HOA By Laws</h3>
            <p className="text-sm text-slate-600">
              Review the governing documents for the association.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/documents/bpha-by-laws.pdf"
              className="text-sm font-semibold text-teal-700 hover:underline"
            >
              Download PDF
            </a>
            <Link
              href="/documents"
              className="text-sm font-semibold text-slate-600 hover:text-teal-700"
            >
              View all documents
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

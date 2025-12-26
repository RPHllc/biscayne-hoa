import Link from 'next/link';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { getArbContent } from '@/lib/content/arb';

function ExternalLinkCard({
  label,
  href,
  description,
}: {
  label: string,
  href: string,
  description?: string,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-teal-200 hover:shadow-sm transition"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <LinkIcon className="w-5 h-5 text-teal-700" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-slate-900">{label}</div>
          {description ? (
            <div className="mt-1 text-sm text-slate-600">{description}</div>
          ) : null}
          <div className="mt-3 text-xs text-teal-700 truncate">{href}</div>
        </div>
      </div>
    </a>
  );
}

export default function ArbPage() {
  const content = getArbContent();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          {content.title}
        </h2>
        <p className="text-lg text-slate-600 max-w-4xl">{content.intro}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Quick Check */}
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {content.quickCheck.title}
            </h3>
          </div>

          <div className="divide-y divide-slate-200">
            {content.quickCheck.items.map((item) => (
              <div key={item.question} className="px-6 py-5">
                <div className="text-lg font-bold text-slate-900">
                  {item.question}
                </div>
                <div className="mt-1 text-slate-600">{item.answer}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Useful Links */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">
            {content.usefulLinks.title}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {content.usefulLinks.items.map((l) => (
              <ExternalLinkCard
                key={l.href}
                label={l.label}
                href={l.href}
                description={l.description}
              />
            ))}
          </div>

          {content.disclaimer ? (
            <p className="text-xs text-slate-500">{content.disclaimer}</p>
          ) : null}

          <p className="text-xs text-slate-500">
            Need to contact the HOA?{' '}
            <Link
              href="/contact"
              className="text-teal-700 hover:text-teal-800 underline underline-offset-4"
            >
              Use the contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

import { Mail, MapPin, Shield } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import { getContactContent } from '@/lib/content/contact';

export const runtime = 'edge';

const ICONS = {
  'map-pin': MapPin,
  shield: Shield,
  mail: Mail,
} as const;

export default function ContactPage() {
  const content = getContactContent();

  return (
    <div className="space-y-3">
      <h2 className="text-4xl font-extrabold text-slate-900">Get in Touch</h2>
      <p className="text-lg text-slate-600">
        Have a question about dues, security, or community events? We&apos;re
        here to help.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-5 space-y-6">
          {content.cards.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <InfoCard
                key={card.id}
                icon={<Icon className="w-5 h-5 text-teal-700" />}
                title={card.title}
              >
                {card.email ? (
                  <a
                    href={`mailto:${card.email}`}
                    className="font-medium text-teal-700 hover:text-teal-800 underline underline-offset-4"
                  >
                    {card.email}
                  </a>
                ) : null}

                {card.lines?.length ? (
                  <div className="text-slate-600 leading-relaxed mt-2">
                    {card.lines.map((line, i) => (
                      <div
                        key={i}
                        className={i === 0 ? 'font-medium text-slate-900' : ''}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                ) : null}

                {card.note ? (
                  <div className="text-sm text-slate-500 mt-2">{card.note}</div>
                ) : null}
              </InfoCard>
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {content.form?.title ?? 'Send a Message'}
              </h3>
            </div>
            <div className="p-6">
              <ContactForm contactContent={content} />
              <p className="text-xs text-slate-500 mt-4">
                {content.form?.subtitle ??
                  'Messages are delivered to the HOA inbox. We will respond as soon as possible.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900">{title}</div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

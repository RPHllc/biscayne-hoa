'use client';

import { useMemo, useState } from 'react';
import type { ContactContent } from '@/lib/content/contact';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
};

export default function ContactForm({
  contactContent,
}: {
  contactContent: ContactContent;
}) {
  const subjects = useMemo(() => {
    return (
      contactContent.form?.subjects ?? [
        'General Inquiry',
        'Dues / Payments',
        'Website / Content Update',
        'Security / Guardhouse',
        'Events / Calendar',
      ]
    );
  }, [contactContent.form?.subjects]);

  const toEmail = contactContent.form?.toEmail ?? 'info@biscaynepoint.org';

  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(() => ({
    firstName: '',
    lastName: '',
    email: '',
    subject: subjects[0] ?? 'General Inquiry',
    phone: '',
    message: '',
  }));

  function updateField<K extends keyof Form>(field: K, value: Form[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setError(null);

    // Keep backend-compatible shape: { name, email, phone, message, subject }
    const payload = {
      name: [form.firstName, form.lastName].filter(Boolean).join(' ').trim(),
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? 'Unable to send message');
      }

      setState('sent');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: subjects[0] ?? 'General Inquiry',
        phone: '',
        message: '',
      });
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Unable to send message');
    }
  }

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`[HOA] ${form.subject}`);
    const body = encodeURIComponent(
      [
        `Name: ${[form.firstName, form.lastName].filter(Boolean).join(' ')}`,
        `Email: ${form.email}`,
        form.phone ? `Phone: ${form.phone}` : null,
        '',
        form.message,
      ]
        .filter(Boolean)
        .join('\n')
    );

    return `mailto:${toEmail}?subject=${subject}&body=${body}`;
  }, [
    toEmail,
    form.firstName,
    form.lastName,
    form.email,
    form.phone,
    form.subject,
    form.message,
  ]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            First Name
          </label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Last Name
          </label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Subject
        </label>
        <select
          value={form.subject}
          onChange={(event) => updateField('subject', event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm bg-white focus:border-teal-500 focus:outline-none"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Message
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {state === 'sending' ? 'Sending…' : 'Send Message'}
      </button>

      {state === 'sent' ? (
        <p className="text-sm text-teal-700">Thanks! Your message was sent.</p>
      ) : null}

      {state === 'error' && error ? (
        <div className="space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-slate-500">
            If the form is having issues, you can email us directly:{' '}
            <a
              href={mailtoHref}
              className="text-teal-700 hover:text-teal-800 underline underline-offset-4"
            >
              {toEmail}
            </a>
          </p>
        </div>
      ) : null}
    </form>
  );
}

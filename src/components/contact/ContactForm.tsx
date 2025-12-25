'use client';

import { useState } from 'react';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? 'Unable to send message');
      }

      setState('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Unable to send message');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
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
        className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {state === 'sending' ? 'Sending…' : 'Send Message'}
      </button>

      {state === 'sent' ? (
        <p className="text-sm text-teal-700">Thanks! Your message was sent.</p>
      ) : null}
      {state === 'error' && error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}
    </form>
  );
}

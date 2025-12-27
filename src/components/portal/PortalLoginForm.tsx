'use client';

import { useState } from 'react';

type Props = {
  streets: string[];
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function PortalLoginForm({ streets }: Props) {
  const [email, setEmail] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState(streets[0] || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const canSubmit =
    isValidEmail(email.trim()) &&
    houseNumber.trim().length > 0 &&
    street.trim().length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/portal/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          houseNumber: houseNumber.trim(),
          street: street.trim(),
        }),
      });

      const data = (await res.json().catch(() => null)) as null | {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data?.error || 'Unable to send access link');
      }

      setMessage(
        'If your payment is current, an access link is on the way. Check your email.'
      );
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : 'Unable to send access link'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            House #
          </label>
          <input
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="7700"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Street
          </label>
          <select
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            {streets.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
          placeholder="you@example.com"
        />
      </div>

      {message ? (
        <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white px-5 py-3 rounded-lg font-semibold transition"
      >
        {loading ? 'Sending link…' : 'Email me a portal link'}
      </button>
    </form>
  );
}

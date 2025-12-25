'use client';

import { useState } from 'react';

type Props = {
  minPayment: number;
  suggestedDonation?: number;
  streets: string[];
};

type FormState = 'idle' | 'sending' | 'error';

export default function PayDuesForm({
  minPayment,
  suggestedDonation,
  streets,
}: Props) {
  const suggestedTotal =
    minPayment + (suggestedDonation && suggestedDonation > 0
      ? suggestedDonation
      : 0);
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState(streets[0] ?? '');
  const [amount, setAmount] = useState(String(minPayment));
  const amountNumber = Number(amount);
  const isAmountValid =
    Number.isFinite(amountNumber) && amountNumber >= minPayment;
  const isFormValid =
    email.trim().length > 0 &&
    houseNumber.trim().length > 0 &&
    street.trim().length > 0 &&
    isAmountValid;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setError(null);

    if (!isAmountValid) {
      setError(`Amount must be at least $${minPayment}`);
      setState('error');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNumber,
          description: 'HOA Dues',
          email,
          address: {
            houseNumber,
            street,
          },
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? 'Checkout failed');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Missing checkout URL');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setState('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Amount (minimum ${minPayment})
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="number"
              min={minPayment}
              step="1"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setAmount(String(minPayment))}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-teal-200 hover:text-teal-700"
          >
            Annual dues
          </button>
          {suggestedDonation && suggestedDonation > 0 ? (
            <button
              type="button"
              onClick={() => setAmount(String(suggestedTotal))}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-teal-200 hover:text-teal-700"
            >
              Dues + ${suggestedDonation} donation
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Email for receipt
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            House number
          </label>
          <input
            type="text"
            required
            value={houseNumber}
            onChange={(event) => setHouseNumber(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Street
          </label>
          <select
            required
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          >
            {streets.length === 0 ? (
              <option value="" disabled>
                Add streets in content/streets.json
              </option>
            ) : null}
            {streets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={state === 'sending' || !isFormValid}
        className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {state === 'sending' ? 'Redirecting…' : 'Continue to payment'}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

'use client';

import { useState } from 'react';

type Props = {
  amount: number; // dollars
  description?: string;
};

export default function PayCheckoutButton({ amount, description }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description }),
      });

      type CheckoutResponse = { url: string } | { error: string };

      const data = (await res.json()) as CheckoutResponse;

      if (!res.ok) {
        throw new Error('error' in data ? data.error : 'Checkout failed');
      }

      if ('url' in data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Missing checkout URL');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? 'Redirecting…' : `Pay $${amount}`}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

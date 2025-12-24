'use client';

import { useState } from 'react';

export default function PayCheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      // Minimal v1 defaults
      const payload = {
        amount_cents: 35000, // TODO: set your real dues amount
        purpose: 'dues',
        // Optional: later read from form inputs
        email: '',
        address: '',
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Checkout failed');

      if (data.url) window.location.href = data.url;
      else throw new Error('Missing checkout url');
    } catch (e: any) {
      alert(e?.message || 'Checkout failed');
      setLoading(false);
    }
  }

  return (
    <button
      onClick={startCheckout}
      disabled={loading}
      className="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
    >
      {loading ? 'Redirecting…' : 'Pay by Card (Stripe)'}
    </button>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function InnerForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pay/success`,
      },
      redirect: 'if_required',
    });

    if (error) setMessage(error.message || 'Payment failed');
    else setMessage('Payment successful. Thank you!');
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement />
      {message ? (
        <div className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg p-3">
          {message}
        </div>
      ) : null}
      <button
        disabled={!stripe || submitting}
        className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white px-5 py-3 rounded-lg font-semibold transition"
      >
        {submitting ? 'Processing…' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function EmbeddedPaymentForm() {
  const [amount, setAmount] = useState(350); // default dues
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createIntent(newAmount: number) {
    setLoading(true);
    setClientSecret(null);

    const res = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: newAmount, description: 'HOA Dues' }),
    });

    const data = (await res.json().catch(() => null)) as null | { clientSecret?: string; error?: string };
    if (!res.ok || !data?.clientSecret) {
      setLoading(false);
      throw new Error(data?.error || 'Failed to start payment');
    }

    setClientSecret(data.clientSecret);
    setLoading(false);
  }

  useEffect(() => {
    createIntent(amount).catch((e) => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => {
    if (!clientSecret) return null;
    return {
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0f766e', // teal vibe
          borderRadius: '10px',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        },
      },
    };
  }, [clientSecret]);

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-slate-900">Pay HOA Dues</h1>
      <p className="mt-2 text-slate-600">
        Secure payment processed by Stripe — without leaving the Biscayne Point site.
      </p>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-semibold text-slate-700">Amount</label>
          <div className="flex items-center gap-2">
            {[350, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  createIntent(preset).catch((e) => console.error(e));
                }}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 hover:border-teal-300"
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        <input
          type="number"
          min={1}
          step="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          onBlur={() => createIntent(amount).catch((e) => console.error(e))}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
        />

        {loading || !options ? (
          <div className="text-sm text-slate-500">Loading secure payment form…</div>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <InnerForm amount={amount} />
          </Elements>
        )}

        <div className="text-xs text-slate-400">
          Tip: Apple Pay / Google Pay will appear automatically when available.
        </div>
      </div>
    </div>
  );
}

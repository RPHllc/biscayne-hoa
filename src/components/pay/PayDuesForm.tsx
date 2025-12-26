'use client';

import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  minPayment: number;
  suggestedDonation: number;
  streets: string[];
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function InnerForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

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

    if (error) {
      setMessage(error.message || 'Payment failed');
    } else {
      setMessage('Payment completed. Check your email for confirmation.');
      setSucceeded(true);
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {succeeded ? null : <PaymentElement />}

      {message ? (
        <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
          {message}
        </div>
      ) : null}

      {succeeded ? null : (
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          {submitting ? 'Processing…' : `Pay $${amount.toFixed(2)}`}
        </button>
      )}

      <div className="text-xs text-slate-500">
        Secure payment processed by Stripe. Apple Pay / Google Pay appear when
        available.
      </div>
    </form>
  );
}

export default function PayDuesForm({
  minPayment,
  suggestedDonation,
  streets,
}: Props) {
  const [street, setStreet] = useState(streets[0] || '');
  const [house, setHouse] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(minPayment + suggestedDonation);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const address = house && street ? `${house} ${street}` : '';
  const donation = Math.max(0, amount - minPayment);
  const emailValid = isValidEmail(email.trim());

  async function createIntent() {
    setLoading(true);
    setInitError(null);
    setClientSecret(null);

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          email: email.trim(),
          houseNumber: house.trim(),
          street: street.trim(),
        }),
      });

      const data = (await res.json().catch(() => null)) as null | {
        clientSecret?: string;
        error?: string;
      };
      if (!res.ok || !data?.clientSecret)
        throw new Error(data?.error || 'Failed to initialize payment');

      setClientSecret(data.clientSecret);
    } catch (e) {
      setInitError(
        e instanceof Error ? e.message : 'Failed to initialize payment'
      );
    } finally {
      setLoading(false);
    }
  }

  const elementsOptions = useMemo<StripeElementsOptions | null>(() => {
    if (!clientSecret) return null;
    return {
      clientSecret,
      paymentMethodOrder: [
        'card',
        'us_bank_account',
        'cashapp',
        'link',
      ],
      defaultValues: {
        billingDetails: {
          email: email.trim() || undefined,
          address: address
            ? {
                line1: address,
              }
            : undefined,
        },
      },
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0f766e', // teal
          borderRadius: '10px',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        },
      },
    };
  }, [clientSecret]);

  const canInit =
    amount >= minPayment &&
    emailValid &&
    house.trim().length > 0 &&
    street.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Resident info */}
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            House #
          </label>
          <input
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            disabled={!!clientSecret}
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
            disabled={!!clientSecret}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            {streets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Email (receipt)
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!clientSecret}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="you@example.com"
          />
          {!emailValid && email.length > 0 ? (
            <div className="text-xs text-rose-600 mt-1">
              Enter a valid email for your receipt.
            </div>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            min={minPayment}
            step="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={!!clientSecret}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <div className="text-xs text-slate-500 mt-1">
            Minimum: ${minPayment}. Suggested donation: ${suggestedDonation}.
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Total: ${amount.toFixed(2)} • Dues: ${minPayment.toFixed(2)} • Donation:{' '}
        ${donation.toFixed(2)}
      </div>

      {/* Initialize */}
      {!clientSecret ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={createIntent}
            disabled={!canInit || loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Preparing payment…' : 'Continue to payment details'}
          </button>

          {initError ? (
            <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
              {initError}
            </div>
          ) : null}

          <div className="text-xs text-slate-500">
            We’ll show the secure payment form next — without leaving the site.
          </div>
        </div>
      ) : null}

      {clientSecret ? (
        <button
          type="button"
          onClick={() => setClientSecret(null)}
          className="text-sm text-teal-700 hover:text-teal-800 font-semibold"
        >
          Edit payment details
        </button>
      ) : null}

      {/* Embedded Stripe */}
      {elementsOptions ? (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <InnerForm amount={amount} />
        </Elements>
      ) : null}
    </div>
  );
}

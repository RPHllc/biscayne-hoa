import Stripe from 'stripe';

export const runtime = 'edge';

type Body = {
  amount: number; // dollars
  email?: string;
  houseNumber?: string;
  street?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getMinPayment() {
  const envValue = Number(process.env.DUES_MIN_PAYMENT);
  return Number.isFinite(envValue) && envValue > 0 ? envValue : 100;
}

function parsePaymentMethodTypes() {
  const raw = process.env.STRIPE_PAYMENT_METHOD_TYPES;
  if (!raw) return null;
  const types = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return types.length > 0 ? types : null;
}

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey)
    return Response.json(
      { error: 'Missing STRIPE_SECRET_KEY' },
      { status: 500 }
    );

  const stripe = new Stripe(secretKey, { apiVersion: '2025-12-15.clover' });

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) return Response.json({ error: 'Invalid JSON' }, { status: 400 });

  const amount = Number(body.amount);
  const minPayment = getMinPayment();
  if (!Number.isFinite(amount) || amount < minPayment) {
    return Response.json(
      { error: `Amount must be at least $${minPayment}` },
      { status: 400 }
    );
  }
  if (amount > 5000) {
    return Response.json(
      { error: 'Amount too large' },
      { status: 400 }
    );
  }

  const amountCents = Math.round(amount * 100);
  const minPaymentCents = Math.round(minPayment * 100);

  const email = body.email?.trim();
  if (!email || !isValidEmail(email)) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const houseNumber = body.houseNumber?.trim();
  const street = body.street?.trim();
  if (!houseNumber || !street) {
    return Response.json(
      { error: 'House number and street are required' },
      { status: 400 }
    );
  }

  const origin = new URL(req.url).origin;
  const addressLine = `${houseNumber} ${street}`.trim();
  const paymentMethodTypes = parsePaymentMethodTypes();

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    ...(paymentMethodTypes
      ? { payment_method_types: paymentMethodTypes }
      : { automatic_payment_methods: { enabled: true } }),
    receipt_email: email,
    metadata: {
      purpose: 'dues',
      street,
      address: addressLine,
      house_number: houseNumber,
      payer_email: email,
      min_payment_cents: String(minPaymentCents),
      donation_cents: String(Math.max(0, amountCents - minPaymentCents)),
      total_cents: String(amountCents),
      origin,
    },
  });

  return Response.json({ clientSecret: intent.client_secret });
}

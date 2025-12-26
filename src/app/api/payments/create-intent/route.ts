import Stripe from 'stripe';

export const runtime = 'edge';

type Body = {
  amount: number; // dollars
  email?: string;
  address?: string; // "7700 Biscayne Point Cir"
  street?: string;
};

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
  if (!Number.isFinite(amount) || amount <= 0) {
    return Response.json(
      { error: 'Amount must be a positive number' },
      { status: 400 }
    );
  }

  const amountCents = Math.round(amount * 100);

  const origin = new URL(req.url).origin;

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true }, // card + wallets where available
    receipt_email: body.email || undefined,
    metadata: {
      purpose: 'dues',
      street: body.street || '',
      address: body.address || '',
      origin,
    },
  });

  return Response.json({ clientSecret: intent.client_secret });
}

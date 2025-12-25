import Stripe from 'stripe';

export const runtime = 'edge';

type CheckoutRequest = {
  amount: number; // dollars
  description?: string;
  email?: string;
  address?: {
    houseNumber?: string;
    street?: string;
  };
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getMinPayment() {
  const envValue = Number(process.env.DUES_MIN_PAYMENT);
  return Number.isFinite(envValue) && envValue > 0 ? envValue : 100;
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      { error: 'Missing STRIPE_SECRET_KEY' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, {
    // Stripe supports fetch in edge runtimes
    apiVersion: '2025-12-15.clover',
  });

  const body = (await request
    .json()
    .catch(() => null)) as CheckoutRequest | null;
  if (!body)
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });

  const amount = Number(body.amount);
  const minPayment = getMinPayment();
  if (!Number.isFinite(amount) || amount < minPayment) {
    return Response.json(
      { error: `Amount must be at least $${minPayment}` },
      { status: 400 }
    );
  }
  if (amount > 5000) {
    return Response.json({ error: 'Amount too large' }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !isValidEmail(email)) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const houseNumber = body.address?.houseNumber?.trim();
  const street = body.address?.street?.trim();
  if (!houseNumber || !street) {
    return Response.json(
      { error: 'House number and street are required' },
      { status: 400 }
    );
  }

  const origin = new URL(request.url).origin;

  // Stripe expects amount in cents
  const amountCents = Math.round(amount * 100);
  const addressLine = `${houseNumber} ${street}`.trim();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: amountCents,
          product_data: {
            name: body.description?.trim() || 'Biscayne Point HOA Payment',
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pay?canceled=1`,
    // helpful metadata for later reconciliation:
    metadata: {
      source: 'biscayne-hoa-site',
      description: body.description?.trim() || '',
      payer_email: email,
      address: addressLine,
    },
  });

  return Response.json({ url: session.url });
}

import Stripe from 'stripe';

type Env = {
  STRIPE_SECRET_KEY: string;
  SITE_URL: string; // e.g. https://biscaynepointer.org
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const body = await request.json().catch(() => null) as null | {
    amount_cents: number;
    purpose: 'dues' | 'donation' | 'other';
    email?: string;
    address?: string;
  };

  if (!body || !Number.isInteger(body.amount_cents) || body.amount_cents < 50) {
    return new Response(JSON.stringify({ error: 'Invalid amount_cents' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!body.purpose) {
    return new Response(JSON.stringify({ error: 'Missing purpose' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    // Cloudflare Workers/Pages should use Fetch for outbound HTTP to Stripe
    httpClient: Stripe.createFetchHttpClient(),
  });

  const successUrl = `${env.SITE_URL}/pay?success=1&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${env.SITE_URL}/pay?canceled=1`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    // Collecting customer email is helpful for receipts/history
    customer_email: body.email || undefined,

    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: body.amount_cents,
          product_data: {
            name:
              body.purpose === 'dues'
                ? 'HOA Dues'
                : body.purpose === 'donation'
                ? 'HOA Donation'
                : 'HOA Payment',
          },
        },
        quantity: 1,
      },
    ],

    success_url: successUrl,
    cancel_url: cancelUrl,

    // Store useful fields so the webhook can write to D1
    metadata: {
      purpose: body.purpose,
      address: body.address || '',
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'content-type': 'application/json' },
  });
};

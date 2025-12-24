import Stripe from 'stripe';

type Env = {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  DB: D1Database;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Stripe requires the *raw* request body for signature verification. :contentReference[oaicite:6]{index=6}
  const rawBody = await request.text();
  const sig = request.headers.get('Stripe-Signature');
  if (!sig) return new Response('Missing Stripe-Signature', { status: 400 });

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  // In Workers/Pages, use constructEventAsync with SubtleCrypto provider. :contentReference[oaicite:7]{index=7}
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err: any) {
    return new Response(`Webhook signature verification failed: ${err?.message ?? 'unknown'}`, {
      status: 400,
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      null;

    const amountCents = session.amount_total ?? null;
    const currency = session.currency ?? 'usd';
    const purpose = (session.metadata?.purpose || 'other') as string;
    const address = session.metadata?.address || '';

    const stripeSessionId = session.id;
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);

    // Insert (idempotent by UNIQUE stripe_session_id)
    if (amountCents !== null) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO payments
          (email, address, purpose, amount_cents, currency, status, method, stripe_session_id, stripe_payment_intent_id, paid_at)
         VALUES
          (?, ?, ?, ?, ?, 'paid', 'stripe', ?, ?, datetime('now'))`
      )
        .bind(
          email,
          address,
          purpose,
          amountCents,
          currency,
          stripeSessionId,
          paymentIntentId
        )
        .run();
    }
  }

  return new Response('ok', { status: 200 });
};

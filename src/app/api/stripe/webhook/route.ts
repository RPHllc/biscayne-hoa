import Stripe from 'stripe';

export const runtime = 'edge';

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return new Response('Missing Stripe env vars', { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });

  // Stripe signature header
  const signature = request.headers.get('stripe-signature');
  if (!signature)
    return new Response('Missing stripe-signature', { status: 400 });

  // IMPORTANT: use raw body for signature verification
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Webhook signature verification failed';
    return new Response(message, { status: 400 });
  }

  // Handle the event you care about first
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // For now: just log to console.
    // Next step: write to D1 and/or send email receipt.
    console.log('checkout.session.completed', {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      payment_intent: session.payment_intent,
      metadata: session.metadata,
    });
  }

  return new Response('ok', { status: 200 });
}

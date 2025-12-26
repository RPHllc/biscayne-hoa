import Stripe from 'stripe';

export const runtime = 'edge';

function formatUsd(amountCents?: number | null) {
  if (!amountCents && amountCents !== 0) return '—';
  return `$${(amountCents / 100).toFixed(2)}`;
}

async function sendPaymentEmails(payload: {
  payerEmail: string;
  hoaEmail: string;
  fromEmail: string;
  amountCents: number;
  donationCents: number;
  address: string;
  paymentId: string;
  method?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Missing RESEND_API_KEY');

  const { payerEmail, hoaEmail, fromEmail, amountCents, donationCents } =
    payload;

  const subject = 'Biscayne Point HOA payment confirmation';
  const text = [
    'Thank you for your payment to Biscayne Point HOA.',
    '',
    `Total paid: ${formatUsd(amountCents)}`,
    `Donation: ${formatUsd(donationCents)}`,
    `Property: ${payload.address}`,
    `Payment ID: ${payload.paymentId}`,
    payload.method ? `Method: ${payload.method}` : null,
    '',
    'If you have any questions, reply to this email.',
  ]
    .filter(Boolean)
    .join('\n');

  const hoaText = [
    'New HOA payment received.',
    '',
    `Total paid: ${formatUsd(amountCents)}`,
    `Donation: ${formatUsd(donationCents)}`,
    `Property: ${payload.address}`,
    `Payer email: ${payerEmail}`,
    `Payment ID: ${payload.paymentId}`,
    payload.method ? `Method: ${payload.method}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const sendEmail = async ({
    to,
    replyTo,
    bodyText,
  }: {
    to: string;
    replyTo?: string;
    bodyText: string;
  }) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        reply_to: replyTo,
        subject,
        text: bodyText,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Resend error: ${detail}`);
    }
  };

  await Promise.all([
    sendEmail({ to: payerEmail, bodyText: text }),
    sendEmail({ to: hoaEmail, replyTo: payerEmail, bodyText: hoaText }),
  ]);
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const paymentsToEmail = process.env.PAYMENTS_TO_EMAIL;
  const paymentsFromEmail = process.env.PAYMENTS_FROM_EMAIL;

  if (!secretKey || !webhookSecret) {
    return new Response('Missing Stripe env vars', { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });

  // Stripe signature header
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    console.error('Stripe webhook missing stripe-signature header');
    return new Response('Missing stripe-signature', { status: 400 });
  }

  // IMPORTANT: use raw body for signature verification
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Webhook signature verification failed';
    console.error('Stripe webhook signature verification failed', {
      message,
      webhookSecretSuffix: webhookSecret.slice(-6),
    });
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

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const payerEmail =
      intent.receipt_email ||
      intent.metadata?.payer_email ||
      intent.charges?.data?.[0]?.billing_details?.email;

    if (!paymentsToEmail || !paymentsFromEmail) {
      console.error('Missing payment email env vars');
      return new Response('Missing payment email env vars', { status: 500 });
    }

    if (!payerEmail) {
      console.error('Missing payer email on payment_intent.succeeded', {
        intentId: intent.id,
      });
      return new Response('Missing payer email', { status: 400 });
    }

    const donationCents = Number(intent.metadata?.donation_cents) || 0;
    const address = intent.metadata?.address || 'Unknown address';
    const method = intent.charges?.data?.[0]?.payment_method_details?.type;

    await sendPaymentEmails({
      payerEmail,
      hoaEmail: paymentsToEmail,
      fromEmail: paymentsFromEmail,
      amountCents: intent.amount_received ?? intent.amount,
      donationCents,
      address,
      paymentId: intent.id,
      method,
    });
  }

  return new Response('ok', { status: 200 });
}

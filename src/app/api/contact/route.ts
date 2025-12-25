export const runtime = 'edge';

type ContactRequest = {
  name: string;
  email: string;
  message: string;
  phone?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return Response.json(
      { error: 'Missing email configuration' },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as ContactRequest | null;
  if (!body) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const phone = body.phone?.trim();

  if (!name || !email || !message) {
    return Response.json(
      { error: 'Name, email, and message are required' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const textLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    '',
    message,
  ].filter(Boolean);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `HOA Contact Form: ${name}`,
      text: textLines.join('\n'),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: 'Failed to send message', detail },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}

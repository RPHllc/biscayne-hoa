import { getDb } from '@/lib/db';
import {
  addMinutes,
  formatUtcIso,
  generateToken,
  hashToken,
  isResidentCurrent,
  normalizeAddress,
  normalizeEmail,
} from '@/lib/portal/utils';

export const runtime = 'edge';

type Body = {
  email?: string;
  houseNumber?: string;
  street?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.PORTAL_FROM_EMAIL || process.env.PAYMENTS_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return Response.json(
      { error: 'Missing email configuration' },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = normalizeEmail(body.email || '');
  if (!email || !isValidEmail(email)) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const normalized = normalizeAddress(body.houseNumber || '', body.street || '');
  if (!normalized.houseNumber || !normalized.street) {
    return Response.json(
      { error: 'House number and street are required' },
      { status: 400 }
    );
  }

  const db = getDb();
  const resident = (await db
    .prepare(
      'SELECT last_paid_at FROM residents WHERE email = ? AND address = ? LIMIT 1'
    )
    .bind(email, normalized.address)
    .first()) as { last_paid_at: string | null } | null;

  const isCurrent = isResidentCurrent(resident?.last_paid_at ?? null);
  if (!isCurrent) {
    return Response.json({ ok: true });
  }

  const token = generateToken();
  const tokenHash = await hashToken(token);
  const now = new Date();
  const expiresAt = addMinutes(now, 15);

  await db
    .prepare(
      `INSERT INTO portal_login_tokens
        (token_hash, email, address, expires_at)
       VALUES (?, ?, ?, ?)`
    )
    .bind(
      tokenHash,
      email,
      normalized.address,
      formatUtcIso(expiresAt)
    )
    .run();

  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const origin =
    process.env.PUBLIC_SITE_URL || (host ? `${proto}://${host}` : undefined);
  if (!origin) {
    return Response.json(
      { error: 'Unable to determine site URL' },
      { status: 500 }
    );
  }
  const link = `${origin}/portal/verify?token=${token}`;

  const emailText = [
    'Your Biscayne Point HOA Resident Portal link:',
    '',
    link,
    '',
    'This link expires in 15 minutes.',
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: 'Your Resident Portal access link',
      text: emailText,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: 'Failed to send access link', detail },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}

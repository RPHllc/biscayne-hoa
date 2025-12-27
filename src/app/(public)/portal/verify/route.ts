import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { addDays, formatUtcIso, generateToken, hashToken } from '@/lib/portal/utils';

export const runtime = 'edge';

const sessionDays = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return Response.redirect(new URL('/portal/login?error=invalid', request.url));
  }

  const db = getDb();
  const tokenHash = await hashToken(token);
  const now = new Date();
  const nowIso = formatUtcIso(now);

  const record = (await db
    .prepare(
      `SELECT email, address, expires_at
       FROM portal_login_tokens
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
       LIMIT 1`
    )
    .bind(tokenHash, nowIso)
    .first()) as
    | { email: string; address: string; expires_at: string }
    | null;

  if (!record) {
    return Response.redirect(new URL('/portal/login?error=expired', request.url));
  }

  await db
    .prepare('UPDATE portal_login_tokens SET used_at = ? WHERE token_hash = ?')
    .bind(nowIso, tokenHash)
    .run();

  const sessionToken = generateToken();
  const sessionHash = await hashToken(sessionToken);
  const sessionExpires = addDays(now, sessionDays);

  await db
    .prepare(
      `INSERT INTO portal_sessions
        (session_hash, email, address, expires_at)
       VALUES (?, ?, ?, ?)`
    )
    .bind(
      sessionHash,
      record.email,
      record.address,
      formatUtcIso(sessionExpires)
    )
    .run();

  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl =
    process.env.PUBLIC_SITE_URL || (host ? `${proto}://${host}` : request.url);
  const response = NextResponse.redirect(new URL('/portal', baseUrl));
  response.cookies.set('portal_session', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: sessionDays * 24 * 60 * 60,
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
  });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

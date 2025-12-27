import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { formatUtcIso, hashToken, isResidentCurrent } from '@/lib/portal/utils';

export const runtime = 'edge';

type SessionRow = {
  email: string;
  address: string;
  expires_at: string;
};

type ResidentRow = {
  last_paid_at: string | null;
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionToken = cookies().get('portal_session')?.value;
  if (!sessionToken) {
    redirect('/portal/login');
  }

  const db = getDb();
  const nowIso = formatUtcIso();
  const sessionHash = await hashToken(sessionToken);
  const session = (await db
    .prepare(
      'SELECT email, address, expires_at FROM portal_sessions WHERE session_hash = ? LIMIT 1'
    )
    .bind(sessionHash)
    .first()) as SessionRow | null;

  if (!session || session.expires_at <= nowIso) {
    redirect('/portal/login?error=expired');
  }

  const resident = (await db
    .prepare(
      'SELECT last_paid_at FROM residents WHERE email = ? AND address = ? LIMIT 1'
    )
    .bind(session.email, session.address)
    .first()) as ResidentRow | null;

  if (!resident || !isResidentCurrent(resident.last_paid_at)) {
    redirect('/portal/login?error=due');
  }

  return <>{children}</>;
}

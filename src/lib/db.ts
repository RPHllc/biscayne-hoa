import { getRequestContext } from '@cloudflare/next-on-pages';
import type { D1Database } from '@cloudflare/workers-types';

export function getDb(): D1Database {
  const context = getRequestContext();
  const db = context?.env?.DB as D1Database | undefined;
  if (!db) {
    throw new Error('Missing D1 database binding');
  }
  return db;
}

export function getDbOptional(): D1Database | null {
  try {
    return getDb();
  } catch {
    return null;
  }
}

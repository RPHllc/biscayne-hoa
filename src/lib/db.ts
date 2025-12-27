import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';

export function getDb(): D1Database {
  const context = getCloudflareContext();
  const db = (context?.env as { DB?: D1Database } | undefined)?.DB;
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

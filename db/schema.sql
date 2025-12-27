CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  email TEXT,
  address TEXT,
  house_number TEXT,
  street TEXT,
  purpose TEXT NOT NULL,             -- dues | donation | other
  amount_cents INTEGER NOT NULL,
  donation_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',

  status TEXT NOT NULL,              -- paid | pending | failed
  method TEXT NOT NULL,              -- stripe

  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,

  paid_at TEXT
);

CREATE TABLE IF NOT EXISTS residents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  email TEXT NOT NULL,
  address TEXT NOT NULL,
  house_number TEXT NOT NULL,
  street TEXT NOT NULL,

  last_paid_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS residents_email_address_idx
  ON residents(email, address);

CREATE TABLE IF NOT EXISTS portal_login_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  used_at TEXT,

  token_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS portal_login_tokens_hash_idx
  ON portal_login_tokens(token_hash);

CREATE TABLE IF NOT EXISTS portal_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,

  session_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS portal_sessions_hash_idx
  ON portal_sessions(session_hash);

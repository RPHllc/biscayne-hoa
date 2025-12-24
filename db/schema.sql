CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  email TEXT,
  address TEXT,
  purpose TEXT NOT NULL,             -- dues | donation | other
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',

  status TEXT NOT NULL,              -- paid | pending | failed
  method TEXT NOT NULL,              -- stripe

  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,

  paid_at TEXT
);

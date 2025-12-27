import { execSync } from 'node:child_process';

const sql = `
INSERT INTO residents
  (email, address, house_number, street, last_paid_at, updated_at)
VALUES
  ('p.ontual@gmail.com', '1234 North Biscayne Point Road', '1234', 'North Biscayne Point Road', datetime('now'), datetime('now'))
ON CONFLICT(email, address) DO UPDATE SET
  last_paid_at = excluded.last_paid_at,
  updated_at = excluded.updated_at;
`;

execSync(
  `npx wrangler d1 execute DB --local --command "${sql
    .trim()
    .replace(/\n/g, ' ')}"`,
  { stdio: 'inherit' }
);

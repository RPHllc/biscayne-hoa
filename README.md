This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Stripe testing (Docker)

This project uses the Stripe CLI container to forward webhooks to your local dev server.

1) Add the Stripe and email env vars to `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=...
PAYMENTS_FROM_EMAIL=...
PAYMENTS_TO_EMAIL=...
```

2) Start the dev stack with the Stripe CLI service:

```bash
docker compose --profile dev up --build
```

3) After Stripe CLI starts, copy the webhook secret it prints and update
`STRIPE_WEBHOOK_SECRET` in `.env.local` (then restart the stack).

The Stripe CLI will forward events to `http://web:3000/api/stripe/webhook`.

## Resident Portal (D1 + magic links)

Portal access is granted to residents who are current on dues (calendar year,
plus a 3‑month grace period). Access links are delivered by email.

Required bindings and env vars:
- D1 binding name: `DB`
- `RESEND_API_KEY`
- `PORTAL_FROM_EMAIL` (fallbacks to `PAYMENTS_FROM_EMAIL`)

Apply the schema to D1:

```bash
wrangler d1 execute <database_name> --file=./db/schema.sql
```

Local testing options:
1) Use Cloudflare Pages **Preview** deployments with D1 bindings configured.
2) Run a local Pages dev environment (outside Docker) so D1 bindings are
   available, then use the app at the dev URL.

Example (replace placeholders):

```bash
wrangler pages dev . --d1 DB=<database_id>
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

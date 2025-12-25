# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains the Next.js App Router routes, layouts, and route groups (e.g., `(public)` and `(portal)`), plus API routes under `src/app/api/`.
- `src/components/` holds shared UI components; `src/lib/` holds data helpers and integrations.
- `content/` stores editable site content (JSON and Markdown news posts). Follow `content/README.md` rules when updating content.
- `public/` contains static assets served at the site root.
- `db/schema.sql` is the database schema reference.

## Build, Test, and Development Commands
- `npm run dev` starts the local Next.js dev server at `http://localhost:3000`.
- `npm run build` creates a production build in `.next/`.
- `npm run start` serves the production build.
- `npm run lint` runs the Next.js ESLint ruleset.
- `docker compose up --build` builds and runs the production container (port `8080` -> `3000`).

## Coding Style & Naming Conventions
- TypeScript/JavaScript with strict TS settings; keep modules in `src/` and use `@/` path alias for imports.
- Match existing formatting: 2-space indentation, single quotes, semicolons, and Tailwind utility classes for styling.
- Content filenames: `content/news/YYYY-MM-DD-short-title.md` (kebab-case, date prefix).

## Testing Guidelines
- No automated test framework is configured yet. Run `npm run lint` and do a quick manual UI pass for changes.
- If you add tests, co-locate them near the feature and document the command in this file.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and sentence case (e.g., "Fix Cloudflare build" or "Integrate Stripe").
- PRs should include a clear description, linked issues (if any), and screenshots for UI changes.
- Call out content updates and any required env var changes in the PR description.

## Configuration & Secrets
- Stripe integration expects `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` at runtime.
- Use `.env.local` for local secrets; never commit credentials.

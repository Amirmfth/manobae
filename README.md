# manobae

A private, bilingual scrapbook for Amir and Kimia, built with Next.js 16, Motion, Prisma, PostgreSQL, and private Supabase Storage.

## Local setup

1. Copy `.env.example` to `.env.local` and provide the database, auth, and storage values.
2. Create a private Supabase Storage bucket named `memories` (or change `SUPABASE_MEDIA_BUCKET`).
3. Link the Supabase CLI to project `aszcepyempkdigccwfdn`, then apply committed migrations with `npm run db:migrate`. Create future migration files with `npm run db:migration:new -- descriptive_name`.
4. Set temporary six-digit values for `AMIR_PASSCODE` and `KIMIA_PASSCODE`, then run `npm run db:seed`.
5. Remove the two plain passcode variables from the deployed environment after seeding. Only salted scrypt hashes are stored in PostgreSQL.
6. Start the app with `npm run dev`.

Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_` variable. The memory bucket must remain private; the app issues short-lived signed URLs on the server.

## Production setup

The Vercel project is linked to `Amirmfth/manobae`; the Frankfurt Supabase project ref is `aszcepyempkdigccwfdn`. Scope every secret to Preview and Production as appropriate. Required variables are documented in `.env.example`. Generate `AUTH_SECRET` with at least 32 random bytes.

Database changes are tracked by the versioned SQL files in `supabase/migrations`. Prisma owns the typed client and relational model, but Prisma Migrate must not be run against this project; mixing two migration histories will cause schema drift.

The authenticated routes are protected twice: `src/proxy.ts` performs an optimistic cookie check, while every data access and Server Action verifies the opaque database session and couple ownership. Login attempts are rate-limited by a secret-keyed request fingerprint.

## Current product slice

- Real Amir/Kimia identity sessions and identity-driven themes
- Our Days month calendar backed by PostgreSQL
- Create, view, edit, and delete events
- Shared and author-specific event memories
- Private multi-photo uploads to Supabase Storage
- Initial deterministic insights for anniversaries, “on this day,” saved places, and resurfaced memories
- Watch Together with Vidstack, persistent playback state/chat, and private Supabase Broadcast/Presence
- Route foundations for Us, Explore, Dreams, Places, Decisions, Date Roulette, and Settings

Questions, appreciations, decisions, dreams, and the Tehran map have database models and route boundaries, but their full interactions intentionally follow the completed calendar/event vertical slice.

Watch Together additionally requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and the server-only legacy `SUPABASE_JWT_SECRET`. The server mints short-lived identity JWTs for private Realtime channels; never expose the JWT secret to the browser.

Hosted Supabase owns `realtime.messages` with a platform role that the migration connector cannot assume. Run `supabase/manual/realtime_watch_policies.sql` once from the project SQL Editor, then disable **Allow public access** in Realtime Settings. The policies only admit short-lived tokens for this couple's `watch:<coupleId>` topic.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

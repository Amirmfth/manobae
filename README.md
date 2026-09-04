# manobae

A private, bilingual scrapbook for Amir and Kimia, built with Next.js 16, Motion, Prisma, PostgreSQL, and private Supabase Storage.

## Local setup

1. Copy `.env.example` to `.env.local` and provide the database, auth, and storage values.
2. Create a private Supabase Storage bucket named `memories` (or change `SUPABASE_MEDIA_BUCKET`).
3. After the Supabase project is connected, create the initial migration with `npm run db:migrate:dev -- --name initial`; deployed environments apply committed migrations with `npm run db:migrate`.
4. Set temporary six-digit values for `AMIR_PASSCODE` and `KIMIA_PASSCODE`, then run `npm run db:seed`.
5. Remove the two plain passcode variables from the deployed environment after seeding. Only salted scrypt hashes are stored in PostgreSQL.
6. Start the app with `npm run dev`.

Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_` variable. The memory bucket must remain private; the app issues short-lived signed URLs on the server.

## Production setup

Import `Amirmfth/manobae` into Vercel, connect a Supabase project, and scope every secret to Preview and Production as appropriate. Required variables are documented in `.env.example`. Generate `AUTH_SECRET` with at least 32 random bytes.

The authenticated routes are protected twice: `src/proxy.ts` performs an optimistic cookie check, while every data access and Server Action verifies the opaque database session and couple ownership. Login attempts are rate-limited by a secret-keyed request fingerprint.

## Current product slice

- Real Amir/Kimia identity sessions and identity-driven themes
- Our Days month calendar backed by PostgreSQL
- Create, view, edit, and delete events
- Shared and author-specific event memories
- Private multi-photo uploads to Supabase Storage
- Initial deterministic insights for anniversaries, “on this day,” saved places, and resurfaced memories
- Route foundations for Us, Explore, Dreams, Places, Decisions, Date Roulette, and Settings

Questions, appreciations, decisions, dreams, and the Tehran map have database models and route boundaries, but their full interactions intentionally follow the completed calendar/event vertical slice.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

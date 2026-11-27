# Supabase changelog

## 2026-11-26 — MCP setup, missing table, row-level security

**Tooling**

- Added the Supabase MCP server to `.mcp.json` (project scope) and signed in.
- Installed the `supabase` and `supabase-postgres-best-practices` agent skills in `.claude/skills/`.
- Wrote `AGENTS.md` (shared guide for every coding agent) and rewrote `CLAUDE.md` to import it.
  The old `CLAUDE.md` was out of date (Next 14, port 3000, wrong env var names and schema).

**Problems found** (by the Supabase MCP and its security advisor)

1. **Missing table:** `PushSubscription` was in `schema.prisma` but no migration created it, so it
   didn't exist in the database. The push notification routes had no table to use.
2. **RLS disabled** on `User`, `WatchEntry` and `_prisma_migrations` (advisor level: critical).
   Anyone with the anon key could read and change those rows, including password hashes.

**Fix:** migration `20261126000000_push_subscription_and_rls`

- Creates `PushSubscription` with its unique `endpoint` index, `userId` index and a foreign key to
  `User` (`ON DELETE CASCADE`).
- Enables RLS, with no policies, on all four tables.

**How it was applied**

1. Confirmed that the 4 earlier migrations were applied and that the only difference between the
   database and the schema was `PushSubscription` (`prisma migrate diff`).
2. Confirmed that `postgres` owns every table, so RLS wouldn't block Prisma.
3. Applied with `prisma migrate deploy`, which runs only pending migrations and never resets the
   database.

**Checks afterwards**

- RLS is on for all 4 tables.
- Prisma still reads every table (25 watch entries, 1 user, 0 push subscriptions).
- `prisma migrate status` reports "Database schema is up to date!".
- The advisor's critical finding is gone. Remaining notices: "RLS Enabled No Policy" (expected)
  and a pending Postgres security patch (see [database.md](./database.md#pending-maintenance)).

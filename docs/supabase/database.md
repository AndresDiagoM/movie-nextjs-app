# Database: migrations and row-level security

## Prisma owns the schema

`prisma/schema.prisma` is the source of truth. Don't create or change tables from the Supabase
dashboard, the SQL editor or the MCP server: changes made there put the database and the schema
out of sync (drift).

Tables are PascalCase and need quotes in SQL: `"User"`, `"WatchEntry"`, `"PushSubscription"`,
plus Prisma's own `"_prisma_migrations"`.

## Making a schema change

1. Edit `prisma/schema.prisma`.
2. Create the migration:
   ```bash
   pnpm exec prisma migrate dev --name <short_name>
   ```
   **If `migrate dev` reports drift and offers to reset the database, answer no.** A reset
   deletes all the data in the remote database. Generate the SQL instead (see below).
3. If the migration creates a table, add `ENABLE ROW LEVEL SECURITY` for it (see the next section).
4. Commit the migration folder together with the schema change.

### Safe alternative: generate the SQL, then deploy

This is how the 2026-11-26 migration was made. It never resets anything:

```bash
# 1. Diff the live database against the schema (read-only)
pnpm exec prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/<timestamp>_<name>/migration.sql

# 2. Review the file, add RLS for new tables, then apply pending migrations only
pnpm exec prisma migrate deploy

# 3. Check
pnpm exec prisma migrate status   # "Database schema is up to date!"
```

Always use the project's Prisma (`pnpm exec prisma`, or `node_modules/.bin/prisma` after
`pnpm install`). A bare `npx prisma` without `node_modules` downloads the latest major, which
has different commands.

## Row-level security (RLS)

Every table has RLS **enabled with no policies**. That's deliberate.

| Who connects | Through | Effect of RLS |
|---|---|---|
| The app (Prisma) | `DATABASE_URL`, as `postgres` | None: `postgres` owns the tables, and RLS doesn't apply to a table's owner |
| Anyone with the anon key | Supabase REST/GraphQL API (`anon` role) | Blocked: no policy grants anything |
| Signed-in Supabase users | Supabase API (`authenticated` role) | Blocked (the app doesn't use Supabase Auth) |

Without RLS, anyone holding the project's public anon key could read or change every row through
the Supabase API, including the password hashes in `User`.

**Rules:**

- Every migration that creates a table must also run
  `ALTER TABLE "<Table>" ENABLE ROW LEVEL SECURITY;`.
- Don't use `FORCE ROW LEVEL SECURITY`: it would apply RLS to the owner and break Prisma.
- Add policies only if the app starts querying Supabase from the browser with `supabase-js`.
- The Supabase advisor will report **"RLS Enabled No Policy"** (level INFO) for each table. That's
  expected; leave it.

To check RLS status:

```sql
select c.relname, c.relrowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by 1;
```

## Pending maintenance

- **Postgres security patches:** the advisor reports that `supabase-postgres-17.4.1.048` has
  updates available. Upgrade from the Supabase dashboard (Settings → Infrastructure). It causes a
  short downtime. Guide: https://supabase.com/docs/guides/platform/upgrading

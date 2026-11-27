# CLAUDE.md

@AGENTS.md

AGENTS.md above is the shared guide for every agent; edit it there, not here. This file only adds
what's specific to Claude Code.

## Supabase MCP

- The `supabase` MCP server is in `.mcp.json`, scoped to project `ncvgqxftooihgjuvjnyw`. It has
  write access (no `read_only=true`).
- Use it to **read**: `list_tables`, `list_migrations`, `execute_sql` for `SELECT`s, `get_advisors`,
  `query_logs`, `search_docs`.
- Don't change the schema with `apply_migration` or DDL through `execute_sql`: Prisma owns the
  schema, and changes made outside it cause drift. Write the migration with
  `npx prisma migrate dev`. If the user explicitly asks for a direct change, confirm first.
- Run `get_advisors` (security) after any schema change and report what it finds.

## Skills

- `supabase` and `supabase-postgres-best-practices` are installed in `.claude/skills/` (version in
  `skills-lock.json`). Load them before any database, migration, row-level security or Supabase work.

## Knowledge graph

- `graphify-out/` holds a graph of this codebase. Orient with `graphify explain "<file or symbol>"`
  from the repo root. Don't run `graphify update` yourself; a SessionEnd hook rebuilds it.

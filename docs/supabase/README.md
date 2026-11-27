# Supabase

The app's PostgreSQL database is hosted on Supabase (project ref `ncvgqxftooihgjuvjnyw`, region
`aws-0-us-east-2`). The app talks to it only through Prisma on the server. It doesn't use
`supabase-js`, Supabase Auth or Storage.

- [Database: migrations and row-level security](./database.md)
- [Changelog](./changelog.md)

## Supabase MCP server (for AI agents)

The repo's `.mcp.json` registers the Supabase MCP server for Claude Code. It's shared with the
repo, and it has no secrets: each person signs in with their own Supabase account.

It was added with:

```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=ncvgqxftooihgjuvjnyw&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching%2Cfeedback%2Cnotebooks"
```

### First-time sign-in

1. In a regular terminal (not an IDE extension), open Claude Code in the repo and run `/mcp`.
2. Approve the project's MCP server if asked.
3. Select `supabase` → **Authenticate**, and approve access in the browser.

`/mcp` should then show "connected to supabase".

### Access level

The server has **write access**: the URL has no `read_only=true`. The agent rules in `CLAUDE.md`
limit it to reading (tables, migrations, `SELECT`s, advisors, logs, docs). Schema changes go
through Prisma migrations, never through the MCP. To make it read-only, append `&read_only=true`
to the URL in `.mcp.json`.

## Agent Skills

The Supabase skills are installed in `.claude/skills/`, with versions pinned in
`skills-lock.json`:

| Skill | Use |
|---|---|
| `supabase` | Any Supabase work: database, auth, RLS, CLI, MCP, debugging, logs |
| `supabase-postgres-best-practices` | Schema, migrations, indexes, RLS policies, slow queries |

They were installed with:

```bash
npx skills add supabase/agent-skills --skill '*' --agent claude-code -y
```

Update them with `npx skills update -p`.

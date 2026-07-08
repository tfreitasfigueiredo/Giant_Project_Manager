# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project

Giant Projects is a Next.js App Router product for executive project management in the Giant Manager ecosystem. The product replaces spreadsheets, Planner routines, and manual status decks with a responsive executive cockpit for projects, phases, activities, risks, issues, time, and status reports.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL / Supabase
- Mobile-first, PWA-ready direction

## Commands

Run these before opening a PR when code changes are made:

```bash
pnpm exec tsc --noEmit
pnpm exec eslint .
pnpm build
```

For Prisma work, only when the issue explicitly allows database changes:

```bash
pnpm exec prisma validate
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm exec prisma db seed
```

## Working Rules

- Always work from an issue with objective, scope, out-of-scope items, and acceptance criteria.
- Always use a feature branch and PR.
- Never commit `.env`, tokens, connection strings, credentials, or personal secrets.
- Do not alter `prisma/schema.prisma`, migrations, or seed unless the issue explicitly says: `altera banco`.
- Keep database access server-side only. Do not expose `DATABASE_URL` or Prisma to browser/client code.
- Preserve the approved executive visual language unless the issue explicitly requests a visual change.
- Keep changes small and controlled. Do not bundle unrelated refactors.
- Do not implement authentication, CRUD, exports, or automation unless explicitly requested.
- Do not merge automatically. Human review and merge are required.

## Required PR Summary

Every PR must report:

- Branch used
- Files changed
- Functions/actions/components created
- Routes tested
- Commands executed
- Database changes, if any
- Out-of-scope items preserved
- Known limitations or follow-ups

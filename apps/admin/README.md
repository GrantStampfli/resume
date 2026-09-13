# @stampfli/admin

Admin CMS for the monorepo content, built with Nuxt 4 + Nuxt UI (dashboard components) and deployed on
Vercel. It edits two things:

- **Resume** — `apps/resume-gen/resume.yml`, edited as a structured form (or raw YAML). The generator
  compiles it to PHP Markdown Extra for HTML/PDF. Locally it can also run the generator to produce the
  output.
- **Portfolio content** — every markdown/yaml/json file under `apps/portfolio/content`, plus a "new project"
  scaffold and image uploads to Vercel Blob.

```bash
cp apps/admin/.env.example apps/admin/.env   # set NUXT_ADMIN_PASSWORD
pnpm admin dev                               # http://localhost:3001
```

## Storage drivers

| Driver   | When                                | What a save does                                                                                                                            |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `db`     | whenever `CONTENT_DATABASE_URL` set | Writes a row in `content_entries` and keeps the previous body in `content_revisions`                                                        |
| `fs`     | default in development              | Writes the file in this checkout; you commit it like any edit                                                                               |
| `github` | default in production/Vercel        | Commits through the GitHub Contents API on the configured branch, which triggers the resume deploy workflow and the Vercel portfolio deploy |

Force one with `NUXT_STORAGE_DRIVER`. The `github` driver needs `NUXT_GITHUB_TOKEN` (fine-grained token
with Contents read/write on the repo), `NUXT_GITHUB_REPO` and `NUXT_GITHUB_BRANCH`.

## Content database

Set `CONTENT_DATABASE_URL` (or `DATABASE_URL` / `POSTGRES_URL`, so a Vercel Postgres store works with no
extra configuration) and the admin switches to the `db` driver from
[`@stampfli/content-db`](../../packages/content-db). Postgres and SQLite are both supported:

```bash
CONTENT_DATABASE_URL=postgres://user:password@host:5432/database
CONTENT_DATABASE_URL=file:.data/content.db   # local
```

Rows are keyed by repository-relative path (`apps/resume-gen/resume.yml`,
`apps/portfolio/content/articles/hello.md`), so the same table backs the resume and the portfolio.

- **Import files** on the dashboard copies the checked-in files into the database. It skips paths that
  already have a row unless you tick _overwrite_, so an import never clobbers an edit.
- **History** on the resume and content editors lists revisions and restores one. Deletes keep a revision
  too, so a removed page can be brought back.
- Publishing: a save updates the database, then the site that renders it is rebuilt, because nothing is
  committed to trigger a build on its own.
  - **Portfolio** — `NUXT_VERCEL_DEPLOY_HOOK_URL` is pinged, and the build reads the rows.
  - **Resume** — a `resume-updated` `repository_dispatch` is sent to `NUXT_GITHUB_REPO`, which runs
    `deploy-resume.yml`; that workflow needs a `CONTENT_DATABASE_URL` repository secret so the generator
    reads the same row. This uses `NUXT_GITHUB_TOKEN`, so the token is required in database mode too —
    without it the save succeeds and the published resume silently stays stale, which the server logs warn
    about.

## Auth

Single-password login (`NUXT_ADMIN_PASSWORD`) with sealed session cookies from
[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) (`NUXT_SESSION_PASSWORD`, 32+ chars).
All `/api/*` handlers call `requireAdmin`.

## Vercel integrations

| Package                  | Where                                              |
| ------------------------ | -------------------------------------------------- |
| `@vercel/blob`           | `server/api/uploads/*` (image uploads)             |
| `@vercel/functions`      | `server/utils/deploy.ts` (`waitUntil` deploy hook) |
| `@vercel/analytics`      | `app/plugins/vercel.client.ts`                     |
| `@vercel/speed-insights` | `app/plugins/vercel.client.ts`                     |

On Vercel set the project root directory to `apps/admin`; `vercel.json` runs the build through Turborepo.

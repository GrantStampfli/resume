# @stampfli/content-db

The content of the site, stored in a database rather than in files. Used by
[`apps/admin`](../../apps/admin) to write and by [`apps/portfolio`](../../apps/portfolio) to build.

Connections go through [db0](https://db0.unjs.io), so the same code runs on Postgres in production and on
a SQLite file locally — no native build step either way (SQLite uses Node's built-in `node:sqlite`).

```ts
import { useContentDatabase } from '@stampfli/content-db'

const database = await useContentDatabase()
await database.write('apps/portfolio/content/articles/hello.md', '# Hello', 'grant')
await database.read('apps/portfolio/content/articles/hello.md')
```

## Configuration

The connection string is read from the first of `CONTENT_DATABASE_URL`, `NUXT_CONTENT_DATABASE_URL`,
`DATABASE_URL` or `POSTGRES_URL` — the last two so a Vercel Postgres store works with no extra
configuration. With none set, `contentDatabaseUrl()` returns `undefined` and callers fall back to files.

```bash
postgres://user:password@host:5432/database
file:.data/content.db     # relative to the app; defaults to this when a URL is passed explicitly
file::memory:             # tests
```

## Schema

| Table                    | Columns                                                  | Notes                                       |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------- |
| `content_entries`        | `path` (PK), `body`, `size`, `updated_at`, `updated_by`  | One row per file                            |
| `content_revisions`      | `id`, `path`, `body`, `size`, `created_at`, `created_by` | Previous body, written on every save/delete |
| `newsletter_subscribers` | `email` (PK), `created_at`, `source`                     | Portfolio sign-up form                      |

Tables are created by `migrate()`, which every method calls and which runs once per instance.

Keys are **repository-relative paths**, so the resume YAML and the portfolio content share one table:
`apps/resume-gen/resume.yml`, `apps/portfolio/content/articles/hello.md`. `paths.ts` has the constants and
helpers, plus `normalizeContentPath`, which decodes and rejects traversal, control characters and
extensions other than `.md`, `.yml`, `.yaml` and `.json`.

## Seeding

`seedFromFiles(database, { rootDir, paths, author, overwrite })` copies the checked-in files into the
database. Existing rows are skipped unless `overwrite` is set, so a seed never clobbers an edit. The admin
exposes it as _Import files_; the portfolio runs it once against an empty database so a fresh deployment
renders the committed content.

```bash
pnpm --filter @stampfli/content-db test
pnpm --filter @stampfli/content-db build
```

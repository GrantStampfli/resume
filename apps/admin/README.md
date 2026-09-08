# @stampfli/admin

Admin CMS for the monorepo content, built with Nuxt 4 + Nuxt UI (dashboard components) and deployed on
Vercel. It edits two things:

- **Resume** — `apps/resume-gen/resume.md`, with a preview that understands the PHP Markdown Extra syntax
  (definition lists, `{#id}` headers). Locally it can also run the generator to produce the HTML/PDF.
- **Portfolio content** — every markdown/yaml/json file under `apps/portfolio/content`, plus a "new project"
  scaffold and image uploads to Vercel Blob.

```bash
cp apps/admin/.env.example apps/admin/.env   # set NUXT_ADMIN_PASSWORD
pnpm admin dev                               # http://localhost:3001
```

## Storage drivers

| Driver   | When                         | What a save does                                                                                                                            |
| -------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `fs`     | default in development       | Writes the file in this checkout; you commit it like any edit                                                                               |
| `github` | default in production/Vercel | Commits through the GitHub Contents API on the configured branch, which triggers the resume deploy workflow and the Vercel portfolio deploy |

Force one with `NUXT_STORAGE_DRIVER`. The `github` driver needs `NUXT_GITHUB_TOKEN` (fine-grained token
with Contents read/write on the repo), `NUXT_GITHUB_REPO` and `NUXT_GITHUB_BRANCH`.

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

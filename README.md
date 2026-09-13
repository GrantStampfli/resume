# stampfli

pnpm + Turborepo monorepo for my resume generator, portfolio site and the admin that manages both.

| App                                  | Stack                                             | Deploys to                   |
| ------------------------------------ | ------------------------------------------------- | ---------------------------- |
| [`apps/resume-gen`](apps/resume-gen) | YAML → Markdown Extra → HTML/PDF (PHP + Chromium) | GitHub Pages → gstampfli.com |
| [`apps/portfolio`](apps/portfolio)   | Nuxt 4, Nuxt UI, Nuxt Content                     | Vercel                       |
| [`apps/admin`](apps/admin)           | Nuxt 4, Nuxt UI, nuxt-auth-utils                  | Vercel                       |

| Package                                      | What it is                                                          |
| -------------------------------------------- | ------------------------------------------------------------------- |
| [`packages/content-db`](packages/content-db) | Database-backed content store shared by the admin and the portfolio |
| [`packages/resume-md`](packages/resume-md)   | Structured resume YAML schema + Markdown Extra serialization        |

## Getting started

```bash
corepack enable            # or: npm i -g pnpm@10
pnpm install               # installs every app; Nuxt apps run `nuxt prepare` on postinstall
pnpm dev                   # turbo run dev — portfolio :3000, admin :3001, resume-gen watch
```

Per app: `pnpm portfolio dev`, `pnpm admin dev`, `pnpm resume-gen build`.

`apps/resume-gen` also needs PHP 8.2+ and Composer (`pnpm resume-gen install:php`), plus Chromium for the
PDF.

## Scripts

| Command          | What it runs                                        |
| ---------------- | --------------------------------------------------- |
| `pnpm build`     | `turbo run build` for every app                     |
| `pnpm lint`      | ESLint (`@antfu/eslint-config`) over the whole repo |
| `pnpm lint:fix`  | Same, with autofix (also runs on pre-commit)        |
| `pnpm typecheck` | `nuxt typecheck` in the Nuxt apps                   |
| `pnpm test`      | PHPUnit (resume-gen) and Vitest (Nuxt apps)         |

Dependency versions are pinned once in the `catalog:` section of `pnpm-workspace.yaml`.

## Content storage

Content lives in the repository as markdown and YAML (`apps/resume-gen/resume.yml`,
`apps/portfolio/content/**`) and the admin edits those files through the `fs` or `github` driver.

Set `CONTENT_DATABASE_URL` (or `DATABASE_URL` / `POSTGRES_URL`) and content moves to a database instead:
the admin writes rows — with revision history and restore — and both sites build from the same rows.
Postgres in production, a SQLite file locally. See [`packages/content-db`](packages/content-db).

Because a database save is not a commit, each site is rebuilt explicitly: the portfolio through
`NUXT_VERCEL_DEPLOY_HOOK_URL`, the resume through a `resume-updated` `repository_dispatch` that runs
`deploy-resume.yml`. Set `CONTENT_DATABASE_URL` in all three places — both Vercel projects and as a
repository secret for that workflow.

## CI / deploys

- `.github/workflows/ci.yml` — lint, typecheck, test and build on every push/PR.
- `.github/workflows/deploy-resume.yml` — builds `apps/resume-gen` and publishes `dist/` to GitHub Pages
  whenever `resume.yml` or the generator changes on `master`.
- The Nuxt apps are Vercel projects with their root directory set to `apps/portfolio` and `apps/admin`;
  each has a `vercel.json` that builds through `turbo` and skips unaffected deploys with `turbo-ignore`.

## Agent skills

`.claude/skills` holds [Anthony Fu's skills](https://github.com/antfu/skills) (Nuxt, Vue, Vite, Vitest,
pnpm, Turborepo, ESLint conventions…). Refresh them with `pnpm skills:update`. See [AGENTS.md](AGENTS.md).

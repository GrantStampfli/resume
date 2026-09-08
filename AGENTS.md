# Agent notes

pnpm + Turborepo monorepo. Follow the conventions in `.claude/skills/antfu` (Anthony Fu's tooling
preferences) and the framework skills alongside it; they were installed with
`pnpm dlx skills add antfu/skills --skill='*'` and can be refreshed with `pnpm skills:update`.

## Layout

| Path              | What it is                                                                  |
| ----------------- | --------------------------------------------------------------------------- |
| `apps/resume-gen` | PHP 8 CLI that renders `resume.md` to HTML/PDF (deployed to gstampfli.com)  |
| `apps/portfolio`  | Nuxt 4 + Nuxt UI + Nuxt Content portfolio site (deployed to Vercel)         |
| `apps/admin`      | Nuxt 4 + Nuxt UI admin that edits the resume markdown and portfolio content |

| Package               | What it is                                                             |
| --------------------- | ---------------------------------------------------------------------- |
| `packages/content-db` | db0-backed content store (Postgres or SQLite) shared by both Nuxt apps |

## Commands

```bash
pnpm install          # workspace install (pnpm catalogs pin versions in pnpm-workspace.yaml)
pnpm dev              # turbo run dev (all apps)
pnpm build            # turbo run build
pnpm lint             # eslint (antfu config) for the whole repo
pnpm typecheck        # vue-tsc via nuxt typecheck
pnpm test             # phpunit + vitest
pnpm <app> <script>   # e.g. pnpm portfolio dev, pnpm resume-gen build
```

## Rules

- Use pnpm, never npm/yarn. New dependency versions go in the `catalog:` in `pnpm-workspace.yaml`.
- Run `pnpm lint:fix` before committing; the pre-commit hook runs lint-staged.
- Nuxt apps use `app/` as `srcDir` (Nuxt 4 layout). Server code lives in `server/`.
- The resume content is `apps/resume-gen/resume.md` and uses PHP Markdown Extra syntax
  (definition lists, `{#id}` header attributes). Do not "fix" that syntax.
- Content is files by default. With `CONTENT_DATABASE_URL` set, the admin writes database rows and the
  portfolio's collections read them (`apps/portfolio/content-sources.ts`) — both modes must keep working,
  and both must produce the same routes.
- Database keys are repository-relative paths. Validate any caller-supplied path with
  `normalizeContentPath` before it reaches the store.

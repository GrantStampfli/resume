# @stampfli/portfolio

Portfolio site built with [Nuxt 4](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) and
[Nuxt Content](https://content.nuxt.com), deployed on Vercel.

```bash
pnpm portfolio dev        # http://localhost:3000
pnpm portfolio build      # nuxt build (Vercel preset is auto-detected on Vercel)
pnpm portfolio generate   # fully static output
pnpm portfolio typecheck
```

## Content

| Path                    | Collection | Notes                                                    |
| ----------------------- | ---------- | -------------------------------------------------------- |
| `content/index.md`      | `pages`    | Home page hero copy and intro                            |
| `content/about.md`      | `pages`    | About page                                               |
| `content/projects/*.md` | `projects` | One file per project; see `content.config.ts` for schema |

Everything under `content/` can be edited from the admin app (`apps/admin`).

## Vercel integrations

| Package                  | Where                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| `@vercel/analytics`      | `app/plugins/vercel.client.ts`                                     |
| `@vercel/speed-insights` | `app/plugins/vercel.client.ts`                                     |
| `@vercel/edge-config`    | `server/utils/flags.ts` (site flags)                               |
| `@vercel/functions`      | `server/api/geo.get.ts`                                            |
| `nuxt-og-image`          | OG images rendered with Satori (`defineOgImageComponent` in pages) |
| `@nuxt/image` (vercel)   | `nuxt.config.ts` → `image.provider`                                |

Copy `.env.example` to `.env` for local overrides. On Vercel, set the project root directory to
`apps/portfolio`; `vercel.json` already runs the build through Turborepo.

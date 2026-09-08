# @stampfli/portfolio

Portfolio site: a Nuxt 4 + Vue port of the [Tailwind Plus Spotlight](https://tailwindcss.com/plus/templates/spotlight)
template, with the content managed by [Nuxt Content](https://content.nuxt.com) and deployed on Vercel.

```bash
pnpm portfolio dev        # http://localhost:3000
pnpm portfolio build      # nuxt build (Vercel preset is auto-detected on Vercel)
pnpm portfolio generate   # fully static output
pnpm portfolio typecheck
```

## Pages

| Route                          | Source                                                                      |
| ------------------------------ | --------------------------------------------------------------------------- |
| `/`                            | `content/index.md` + latest articles + `content/experience.yml` (Work card) |
| `/about`                       | `content/about.md`                                                          |
| `/articles`, `/articles/:slug` | `content/articles/*.md`                                                     |
| `/projects`, `/projects/:slug` | `content/projects.yml` (header) + `content/projects/*.md`                   |
| `/speaking`                    | `content/speaking.yml`                                                      |
| `/uses`                        | `content/uses.yml`                                                          |
| `/thank-you`                   | newsletter confirmation                                                     |
| `/feed.xml`                    | RSS feed of the articles (`feed`)                                           |
| `/sitemap.xml`                 | generated from the collections                                              |

Everything under `content/` can be edited from the admin app (`apps/admin`). Site name, socials and the
navigation live in `app/app.config.ts`.

## Template port notes

- Tailwind CSS v4 through `@tailwindcss/vite`; the Spotlight prose theme is in `typography.ts` and loaded
  with `@config` from `app/assets/css/main.css`.
- Dark mode: `@nuxtjs/color-mode` toggles the `dark` class on `<html>`; `ThemeToggle.vue` mirrors the
  template's sun/moon button.
- The header's shrinking-avatar scroll effect is `app/composables/useHeaderScroll.ts`.
- Mobile navigation uses `@headlessui/vue` (Popover) like the original uses Headless UI for React.
- Icons are the template's inline SVGs as components under `app/components/icons/`.
- Images (`public/images`): avatar/portrait and the five photos on the home page.

## Vercel integrations

| Package                  | Where                                            |
| ------------------------ | ------------------------------------------------ |
| `@vercel/analytics`      | `app/plugins/vercel.client.ts`                   |
| `@vercel/speed-insights` | `app/plugins/vercel.client.ts`                   |
| `@vercel/edge-config`    | `server/utils/flags.ts` (site flags)             |
| `@vercel/functions`      | `server/api/geo.get.ts`                          |
| `nuxt-og-image`          | OG images (`components/OgImage/Site.takumi.vue`) |
| `@nuxt/image` (vercel)   | `nuxt.config.ts` → `image.provider`              |

Copy `.env.example` to `.env` for local overrides. On Vercel, set the project root directory to
`apps/portfolio`; `vercel.json` already runs the build through Turborepo.

Spotlight is a commercial template licensed under the
[Tailwind Plus license](https://tailwindcss.com/plus/license); this port is for this site only.

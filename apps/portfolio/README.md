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

## Content source

By default the collections read the markdown and YAML in `content/`. Set `CONTENT_DATABASE_URL` (or
`DATABASE_URL` / `POSTGRES_URL`) and they read the rows the admin writes instead, through a
[custom collection source](https://content.nuxt.com/docs/collections/sources) in `content-sources.ts`:

```bash
CONTENT_DATABASE_URL=postgres://user:password@host:5432/database
CONTENT_DATABASE_URL=file:.data/content.db   # local
```

Pages and `queryCollection` are identical either way — the two modes produce the same routes. Content is
read at build time, so publishing an edit means a rebuild; the admin's deploy hook does that. An empty
database is seeded once from the files in this checkout, so a fresh deployment renders the committed
content rather than nothing.

Newsletter sign-ups (`server/api/subscribe.post.ts`) go to `newsletter_subscribers` when a database is
configured, and are only logged when one is not.

## Template port notes

- Nuxt UI v4 provides the app shell (`UApp`), toasts, icons and the mobile navigation modal; it registers
  the Tailwind CSS v4 Vite plugin itself. The Spotlight prose theme is in `typography.ts` and loaded with
  `@config` from `app/assets/css/main.css`, and the Nuxt UI palette is set in `app/app.config.ts`.
- Dark mode: `@nuxtjs/color-mode` toggles the `dark` class on `<html>`; `ThemeToggle.vue` mirrors the
  template's sun/moon button.
- The header's shrinking-avatar scroll effect is `app/composables/useHeaderScroll.ts`.
- Mobile navigation is `MobileNavigation.vue`, a `UModal` restyled into the template's top panel.
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

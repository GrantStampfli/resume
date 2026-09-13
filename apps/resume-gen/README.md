# @stampfli/resume-gen

YAML → Markdown Extra → HTML/PDF resume generator. The editable source of truth is
[`resume.yml`](./resume.yml); `@stampfli/resume-md` compiles it to PHP Markdown Extra, and the PHP
CLI in [`app/`](./app) renders that with one of the bundled templates into `dist/`, which is what
gets deployed to [gstampfli.com](https://gstampfli.com).

## Requirements

- Node.js 22+ (for the YAML compile step)
- PHP 8.2+ with `mbstring`, `dom` and `libxml`
- [Composer](https://getcomposer.org)
- Chromium or Google Chrome for PDF output (or `wkhtmltopdf` as a fallback)

## Usage

```bash
# from the monorepo root
pnpm resume-gen build      # compile resume.yml + html + pdf → apps/resume-gen/dist
pnpm resume-gen dev        # rebuild whenever resume.yml or a template changes
pnpm resume-gen preview    # serve dist/ on http://localhost:4173
pnpm resume-gen test       # PHPUnit
pnpm resume-gen lint:php   # php-cs-fixer (dry run)
```

Or call the CLI directly on compiled markdown:

```bash
cd apps/resume-gen
pnpm build                 # writes .data/resume.md then renders
app/bin/resume templates
app/bin/resume html --template modern --output index .data/resume.md dist
app/bin/resume pdf  --template modern .data/resume.md dist
pnpm stats
```

### Environment variables

| Variable               | Purpose                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| `RESUME_TEMPLATE`      | Template used by `pnpm build` (default `modern`)                          |
| `RESUME_SKIP_PDF`      | Set to `1` to skip PDF generation                                         |
| `RESUME_PDF_ENGINE`    | Force `chromium` or `wkhtmltopdf`                                         |
| `RESUME_CHROMIUM_PATH` | Explicit path to a Chrome/Chromium binary (`CHROME_PATH` also works)      |
| `RESUME_TEMPLATE_PATH` | Directory containing templates (defaults to `app/templates`)              |
| `CONTENT_DATABASE_URL` | Build from the resume row in the content database instead of `resume.yml` |

## Content source

Edit structured fields in [`resume.yml`](./resume.yml) (name, contact, skills, experience, …). The
build compiles that YAML into Markdown Extra (definition lists, `{#id}` headers) so the existing
Twig templates keep working without hand-maintaining Extra syntax.

When `CONTENT_DATABASE_URL` (or `DATABASE_URL` / `POSTGRES_URL`) is set — the mode where the admin
saves the resume as a database row rather than a commit — `scripts/build.mjs` materialises the
`apps/resume-gen/resume.yml` row into `.data/` and builds from that, leaving the checked-in file
alone. If no row exists yet it falls back to the checkout. Legacy markdown rows (starting with `#`)
are still rendered as-is for one release of migration.

Because a database save produces no commit, the admin pings a `resume-updated`
[`repository_dispatch`](../../.github/workflows/deploy-resume.yml) to rebuild the published resume;
that workflow passes `secrets.CONTENT_DATABASE_URL` through to this build.

## Templates

`modern` (default), `swissen`, `blockish`, `readable` and `unstyled`. A template is a directory with an
`index.html` (Twig), a `css/` directory (LESS or CSS, compiled and inlined so the output is a single file)
and an optional `links/` directory whose files are injected into `<head>`. Pass an absolute path to
`--template` to use a custom one.

## Acknowledgments

- Original generator: [there4/markdown-resume](https://github.com/there4/markdown-resume) by Craig Davis
- Base template style: [Sample Resume Template](http://sampleresumetemplate.net/)

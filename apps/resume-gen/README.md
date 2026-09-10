# @stampfli/resume-gen

Markdown → HTML/PDF resume generator. The source of truth is [`resume.md`](./resume.md); the PHP CLI in
[`app/`](./app) renders it with one of the bundled templates into `dist/`, which is what gets deployed to
[gstampfli.com](https://gstampfli.com).

## Requirements

- PHP 8.2+ with `mbstring`, `dom` and `libxml`
- [Composer](https://getcomposer.org)
- Chromium or Google Chrome for PDF output (or `wkhtmltopdf` as a fallback)

## Usage

```bash
# from the monorepo root
pnpm resume-gen build      # composer install (if needed) + html + pdf → apps/resume-gen/dist
pnpm resume-gen dev        # rebuild whenever resume.md or a template changes
pnpm resume-gen preview    # serve dist/ on http://localhost:4173
pnpm resume-gen test       # PHPUnit
pnpm resume-gen lint:php   # php-cs-fixer (dry run)
```

Or call the CLI directly:

```bash
cd apps/resume-gen
app/bin/resume templates
app/bin/resume html --template modern --output index resume.md dist
app/bin/resume pdf  --template modern resume.md dist
app/bin/resume stats resume.md
```

### Environment variables

| Variable               | Purpose                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| `RESUME_TEMPLATE`      | Template used by `pnpm build` (default `modern`)                         |
| `RESUME_SKIP_PDF`      | Set to `1` to skip PDF generation                                        |
| `RESUME_PDF_ENGINE`    | Force `chromium` or `wkhtmltopdf`                                        |
| `RESUME_CHROMIUM_PATH` | Explicit path to a Chrome/Chromium binary (`CHROME_PATH` also works)     |
| `RESUME_TEMPLATE_PATH` | Directory containing templates (defaults to `app/templates`)             |
| `CONTENT_DATABASE_URL` | Build from the resume row in the content database instead of `resume.md` |

## Content source

By default the build reads [`resume.md`](./resume.md) from this directory. When
`CONTENT_DATABASE_URL` (or `DATABASE_URL` / `POSTGRES_URL`) is set — the mode where the admin saves
the resume as a database row rather than a commit — `scripts/build.mjs` materialises the
`apps/resume-gen/resume.md` row into `.data/resume.md` and builds from that, leaving the checked-in
file alone. If no row exists yet it falls back to the checkout.

The database client is imported lazily, so without a database URL this script still needs nothing but
Node, PHP and Composer.

Because a database save produces no commit, the admin pings a `resume-updated`
[`repository_dispatch`](../../.github/workflows/deploy-resume.yml) to rebuild the published resume;
that workflow passes `secrets.CONTENT_DATABASE_URL` through to this build.

## Templates

`modern` (default), `swissen`, `blockish`, `readable` and `unstyled`. A template is a directory with an
`index.html` (Twig), a `css/` directory (LESS or CSS, compiled and inlined so the output is a single file)
and an optional `links/` directory whose files are injected into `<head>`. Pass an absolute path to
`--template` to use a custom one.

## Markdown

Content is rendered with PHP Markdown Extra + SmartyPants, so definition lists (`Term` / `: definition`)
and header ids (`### Skills {#skills}`) work as before.

## Acknowledgments

- Original generator: [there4/markdown-resume](https://github.com/there4/markdown-resume) by Craig Davis
- Base template style: [Sample Resume Template](http://sampleresumetemplate.net/)

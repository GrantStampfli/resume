---
title: Rendering my resume from markdown with PHP 8 and headless Chromium
description: My resume has been a markdown file since 2016. Here is how I dragged the PHP tool that renders it into 2026 without changing the file it reads.
date: 2026-09-01
---

My resume is a single markdown file. A small PHP command line tool, forked years ago from
[markdown-resume](https://github.com/there4/markdown-resume), turns it into a self-contained HTML page
and a PDF. That tool had not been touched in a decade: Symfony Console 2, Twig 1, an abandoned LESS
compiler and a PDF renderer, wkhtmltopdf, whose upstream project has been archived.

The markdown itself was fine. I wanted to keep it exactly as it was, definition lists and all, and only
replace the machinery around it.

## Keeping the markdown dialect

The file uses PHP Markdown Extra syntax. Definition lists are what make the experience section work:

```markdown
Expeditors
: *Senior Full Stack Engineer*
  __May 2020-Present__
  The Koho project: a digital 3PL offering LTL instant rates...
```

Header attributes give each section an id the stylesheet can target:

```markdown
### Skills {#skills}
```

Neither is CommonMark, so swapping in a different parser would have meant rewriting the content. The
maintained `michelf/php-markdown` 2.x still speaks that dialect, so the parser stayed.

## What changed

- **Symfony Console 7** with attribute-based commands and typed return codes.
- **Twig 3** for both the console views and the HTML templates. The templates were Mustache, which is
  no longer maintained, and the conversion was a handful of `{{{ style }}}` to `{{ style|raw }}` edits.
- **wikimedia/less.php** in place of Assetic and lessphp. The template stylesheets use LESS nesting even
  in files that end with `.css`, and one template kept its variables in a different file from where they
  were used, so the compiler now concatenates a template's `css/` directory before parsing.
- **DOMDocument** instead of a simple-html-dom fork, to pull the `h1` and `h2` out of the rendered
  markdown for the page title.

## The PDF

wkhtmltopdf is a dead end, so the PDF command now looks for Chromium or Google Chrome and prints with
the headless `--print-to-pdf` flag:

```php
$command = [
    $binary,
    '--headless=new',
    '--no-pdf-header-footer',
    '--print-to-pdf='.$destination,
    'file://'.realpath($sourceHtml),
];
```

The templates already shipped print-specific rules under `body.pdf`, so the renderer just adds that class
to the body before printing. wkhtmltopdf is still supported as a fallback if that is what a machine has.

## Tests

The original suite had two tests. The new one renders every bundled template against a fixture, checks
that SmartyPants turned straight quotes into typographic ones, that LESS nesting compiled, and that a
PDF starts with `%PDF` when an engine is installed. It runs in GitHub Actions on every push, and the
same workflow publishes the output to GitHub Pages.

The markdown file did not change by a single byte.

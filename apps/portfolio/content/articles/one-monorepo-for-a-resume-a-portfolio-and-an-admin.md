---
title: One monorepo for a resume, a portfolio and the admin that edits both
description: Why three small apps with three different runtimes ended up in a single pnpm workspace, and what Turborepo actually buys at this size.
date: 2026-09-05
---

This site, my resume generator and the admin I use to edit them live in one repository. That is three
apps: a PHP command line tool, a Nuxt site and a Nuxt dashboard. Putting them together was less about
sharing code and more about sharing decisions.

## One place for versions

pnpm workspaces support a version catalog. Every dependency version is written once in
`pnpm-workspace.yaml` and packages reference it with `catalog:`:

```yaml
catalog:
  nuxt: ^4.5.2
  '@nuxt/content': ^3.16.0
  tailwindcss: ^4.3.3
```

```json
{
  "dependencies": {
    "nuxt": "catalog:",
    "@nuxt/content": "catalog:"
  }
}
```

Upgrading Nuxt is a one-line change that applies to both apps. There is no way for the portfolio and the
admin to drift apart by accident.

## One lint config

A single `eslint.config.js` at the root, using `@antfu/eslint-config`, covers Vue, TypeScript, YAML,
Markdown and JSON across every app. It formats as well as lints, so there is no Prettier and no argument
about which one wins. A pre-commit hook runs it on staged files.

## What Turborepo adds

At three packages, Turborepo is not about parallelism. It is about a task graph with cached outputs:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".output/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

`pnpm build` builds whatever changed and replays the rest from cache. On Vercel, `turbo-ignore` skips
deploys for apps whose inputs did not change, so a resume edit does not redeploy the admin.

## The PHP app is a workspace package too

The resume generator has a `package.json` with `build`, `test` and `lint:php` scripts that shell out to
Composer and PHP. Turborepo does not care what a task runs, only that it exists, so `pnpm test` runs
PHPUnit next to Vitest and the CI workflow reads the same graph.

The one wrinkle is environment variables. Turborepo runs tasks in strict mode and only passes through
what is declared, so `COMPOSER_*` and `RESUME_*` are listed explicitly. That took an hour to find and is
worth writing down.

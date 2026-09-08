---
title: A tiny CMS that commits to git
description: The admin behind this site has one user, one password and no database. Every save is a file write locally and a commit in production.
date: 2026-09-07
---

I wanted to edit my resume and this site from a browser without giving up markdown files in git. The
answer was a small Nuxt app with two storage drivers and no database.

## Two drivers, one interface

Every API route talks to a `ContentStore`:

```ts
export interface ContentStore {
  list: (directory: string) => Promise<StoredEntry[]>
  read: (path: string) => Promise<string | null>
  write: (path: string, content: string, message: string) => Promise<void>
  remove: (path: string, message: string) => Promise<void>
}
```

Locally the `fs` driver edits the checkout, and I commit the result like any other change. On Vercel the
filesystem is read-only, so the `github` driver writes through the GitHub Contents API instead. Each save
becomes a commit with a message like `content(portfolio): update articles/hello.md via admin`, which
triggers the same CI and deploys as a push from my laptop.

## Guarding the paths

The store only ever sees two roots: the resume markdown and the portfolio's `content/` directory.
Anything the browser sends is normalised first:

```ts
if (cleaned.split('/').some(segment => segment === '.' || segment === '..'))
  throw new Error('Invalid path')

if (!EDITABLE_EXTENSIONS.some(extension => cleaned.endsWith(extension)))
  throw new Error('Only .md, .yml, .yaml, .json files can be edited')
```

A request for `../../package.json` gets a 400 before it reaches the store, and the filesystem driver
double-checks that the resolved path is still inside the repository.

## Auth

One password, compared in constant time, and a sealed session cookie from `nuxt-auth-utils`. There is no
user table because there is no second user.

## Preview that matches the renderer

The resume uses PHP Markdown Extra features such as definition lists. The admin's preview runs
markdown-it with the `deflist` and `attrs` plugins, so what I see in the editor is close to what the PHP
tool produces. It is not identical, and it does not need to be. The real build runs in CI.

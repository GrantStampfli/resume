---
title: Markdown Resume Generator
description: The PHP CLI that renders my resume from markdown to a single-file HTML page and a PDF.
date: 2026-09-01
featured: true
tags:
  - Open source
  - Tooling
stack:
  - PHP 8
  - Symfony Console
  - Twig
  - Chromium
repo: https://github.com/GrantStampfli/resume
---

My resume is a markdown file. A small PHP CLI renders it with a template, inlines the compiled LESS so
the output is a single HTML file, and prints a PDF with headless Chromium. It lives in this monorepo under
`apps/resume-gen` and is edited through the admin app.

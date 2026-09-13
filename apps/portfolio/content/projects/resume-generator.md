---
title: Resume Generator
description: Structured YAML resume data compiled to Markdown Extra, then rendered to HTML and PDF.
date: 2026-09-01
featured: true
tags:
  - Open source
  - Tooling
stack:
  - YAML
  - PHP 8
  - Symfony Console
  - Twig
  - Chromium
repo: https://github.com/GrantStampfli/resume
---

My resume is structured YAML. A small compile step turns it into Markdown Extra, and a PHP CLI renders
that with a template, inlines the CSS so the output is a single HTML file, and prints a PDF with
headless Chromium. It lives in this monorepo under `apps/resume-gen` and is edited through the admin app.

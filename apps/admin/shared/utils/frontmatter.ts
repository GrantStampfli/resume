const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/

/** Strips a YAML front matter block so a markdown body can be previewed. Runs in the browser too. */
export function stripFrontmatter(markdown: string): string {
  return markdown.replace(FRONTMATTER, '')
}

export function projectTemplate(title: string): string {
  const today = new Date().toISOString().slice(0, 10)

  return `---
title: ${title}
description: One sentence about the project.
date: ${today}
featured: false
draft: true
tags: []
stack: []
---

Describe the project here.
`
}

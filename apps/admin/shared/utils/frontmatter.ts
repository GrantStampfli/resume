const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/

/** Strips a YAML front matter block so a markdown body can be previewed. Runs in the browser too. */
export function stripFrontmatter(markdown: string): string {
  return markdown.replace(FRONTMATTER, '')
}

export type ContentKind = 'project' | 'article'

export const CONTENT_KINDS: Record<ContentKind, { label: string, directory: string, placeholder: string }> = {
  project: { label: 'project', directory: 'projects', placeholder: 'My next project' },
  article: { label: 'article', directory: 'articles', placeholder: 'What I learned shipping…' },
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function projectTemplate(title: string): string {
  return `---
title: ${title}
description: One sentence about the project.
date: ${today()}
featured: false
draft: true
tags: []
stack: []
---

Describe the project here.
`
}

export function articleTemplate(title: string): string {
  return `---
title: ${title}
description: One or two sentences that show up in the article list and the RSS feed.
date: ${today()}
draft: true
---

Write the article here.
`
}

export function templateFor(kind: ContentKind, title: string): string {
  return kind === 'article' ? articleTemplate(title) : projectTemplate(title)
}

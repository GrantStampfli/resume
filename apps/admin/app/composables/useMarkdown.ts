import MarkdownIt from 'markdown-it'
import attrs from 'markdown-it-attrs'
import deflist from 'markdown-it-deflist'

type Renderer = InstanceType<typeof MarkdownIt>

let instance: Renderer | undefined

function create(): Renderer {
  return new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(deflist)
    .use(attrs)
}

/**
 * markdown-it configured to match the PHP Markdown Extra features the resume relies on:
 * definition lists (`Term` / `: definition`), header attributes (`{#id}`) and smart punctuation.
 */
export function useMarkdown(): { render: (markdown: string) => string } {
  instance ??= create()
  const renderer = instance

  return {
    render: (markdown: string) => renderer.render(markdown),
  }
}

// @env node

import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')

  const [articles, projects] = await Promise.all([
    queryCollection(event, 'articles').where('draft', '=', false).select('path', 'date').all(),
    queryCollection(event, 'projects').where('draft', '=', false).select('path', 'date').all(),
  ])

  const urls: { loc: string, lastmod?: string }[] = [
    { loc: '/' },
    { loc: '/about' },
    { loc: '/articles' },
    ...articles.map(article => ({ loc: article.path, lastmod: article.date })),
    { loc: '/projects' },
    ...projects.map(project => ({ loc: project.path, lastmod: project.date })),
    { loc: '/speaking' },
    { loc: '/uses' },
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${siteUrl}${url.loc}</loc>${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`

  setResponseHeader(event, 'content-type', 'application/xml')
  return body
})

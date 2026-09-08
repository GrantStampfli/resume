// @env node

import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

  const [pages, projects] = await Promise.all([
    queryCollection(event, 'pages').select('path').all(),
    queryCollection(event, 'projects').where('draft', '=', false).select('path', 'date').all(),
  ])

  const urls: { loc: string, lastmod?: string }[] = [
    ...pages.map(page => ({ loc: page.path })),
    { loc: '/projects' },
    ...projects.map(project => ({ loc: project.path, lastmod: project.date })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${siteUrl}${url.loc}</loc>${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`

  setResponseHeader(event, 'content-type', 'application/xml')
  return body
})

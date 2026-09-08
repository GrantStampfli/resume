// @env node

import { queryCollection } from '@nuxt/content/server'
import { Feed } from 'feed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const appConfig = useAppConfig()

  const author = {
    name: appConfig.site.name,
    email: appConfig.site.email,
    link: siteUrl,
  }

  const feed = new Feed({
    title: author.name,
    description: appConfig.site.description,
    author,
    id: siteUrl,
    link: siteUrl,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  const articles = await queryCollection(event, 'articles')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()

  for (const article of articles) {
    const url = `${siteUrl}${article.path}`

    feed.addItem({
      title: article.title,
      id: url,
      link: url,
      description: article.description,
      author: [{ name: article.author }],
      date: new Date(`${article.date}T00:00:00Z`),
    })
  }

  setResponseHeaders(event, {
    'content-type': 'application/xml',
    'cache-control': 's-maxage=3600, stale-while-revalidate=86400',
  })

  return feed.rss2()
})

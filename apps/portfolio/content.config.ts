import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const link = z.object({
  label: z.string(),
  to: z.string(),
  icon: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: {
        include: '*.md',
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        headline: z.string().optional(),
        links: z.array(link).optional(),
      }),
    }),

    projects: defineCollection({
      type: 'page',
      source: {
        include: 'projects/*.md',
        prefix: '/projects',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        stack: z.array(z.string()).default([]),
        url: z.string().url().optional(),
        repo: z.string().url().optional(),
      }),
    }),
  },
})

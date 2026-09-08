import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const link = z.object({
  label: z.string(),
  to: z.string(),
  icon: z.string().optional(),
  trailingIcon: z.string().optional(),
  target: z.string().optional(),
  color: z.string().optional(),
  variant: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    /** Home hero (`index.md`) and the About section (`about.md`). */
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
        /** Hero background slides, relative to /public. */
        slides: z.array(z.string()).optional(),
        avatar: z.string().optional(),
        quote: z.string().optional(),
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

    /** Technologies grid (`tech.yml`). */
    tech: defineCollection({
      type: 'data',
      source: 'tech.yml',
      schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        items: z.array(z.object({
          name: z.string(),
          icon: z.string(),
          note: z.string().optional(),
        })),
      }),
    }),

    /** Work history and education timeline (`experience.yml`). */
    experience: defineCollection({
      type: 'data',
      source: 'experience.yml',
      schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        items: z.array(z.object({
          organisation: z.string(),
          role: z.string(),
          start: z.string(),
          end: z.string().optional(),
          location: z.string().optional(),
          url: z.string().optional(),
          summary: z.string(),
          highlights: z.array(z.string()).default([]),
          kind: z.enum(['work', 'education']).default('work'),
        })),
      }),
    }),
  },
})

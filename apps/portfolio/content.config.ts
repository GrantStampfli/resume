import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const link = z.object({
  href: z.string(),
  label: z.string(),
})

export default defineContentConfig({
  collections: {
    /** Home (`index.md`) and About (`about.md`). */
    pages: defineCollection({
      type: 'page',
      source: {
        include: '*.md',
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        /** Home: the five rotated photos under the intro, relative to /public. */
        photos: z.array(z.string()).optional(),
        /** About: portrait image, relative to /public. */
        portrait: z.string().optional(),
        email: z.string().optional(),
      }),
    }),

    /** Long-form writing (`articles/*.md`). */
    articles: defineCollection({
      type: 'page',
      source: {
        include: 'articles/*.md',
        prefix: '/articles',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string().default('Grant Stampfli'),
        date: z.string(),
        draft: z.boolean().default(false),
      }),
    }),

    /** Projects grid (`projects/*.md`); the body renders on the project page. */
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
        /** Square logo shown in the card, relative to /public. Falls back to initials. */
        logo: z.string().optional(),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        stack: z.array(z.string()).default([]),
        url: z.string().url().optional(),
        repo: z.string().url().optional(),
      }),
    }),

    /** Work history for the home page "Work" card (`experience.yml`). */
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
          logo: z.string().optional(),
          summary: z.string(),
          highlights: z.array(z.string()).default([]),
          kind: z.enum(['work', 'education']).default('work'),
        })),
      }),
    }),

    /** Talks and podcasts (`speaking.yml`). */
    speaking: defineCollection({
      type: 'data',
      source: 'speaking.yml',
      schema: z.object({
        title: z.string(),
        intro: z.string(),
        sections: z.array(z.object({
          title: z.string(),
          appearances: z.array(z.object({
            title: z.string(),
            description: z.string(),
            event: z.string(),
            cta: z.string(),
            href: z.string(),
          })),
        })),
      }),
    }),

    /** Tools and gear (`uses.yml`). */
    uses: defineCollection({
      type: 'data',
      source: 'uses.yml',
      schema: z.object({
        title: z.string(),
        intro: z.string(),
        sections: z.array(z.object({
          title: z.string(),
          tools: z.array(z.object({
            title: z.string(),
            href: z.string().optional(),
            description: z.string(),
          })),
        })),
      }),
    }),

    /** Copy for the projects page header and the project links (`projects.yml`). */
    projectsPage: defineCollection({
      type: 'data',
      source: 'projects.yml',
      schema: z.object({
        title: z.string(),
        intro: z.string(),
        links: z.array(link).optional(),
      }),
    }),
  },
})

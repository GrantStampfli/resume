// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'nuxt-og-image',
  ],

  devtools: { enabled: true },

  app: {
    // Give the Nuxt root a definite width so the photo strip's min-content width cannot
    // widen the page on small screens (same reason Spotlight wraps its layout in `flex w-full`).
    rootAttrs: { class: 'flex w-full min-w-0' },
    head: {
      htmlAttrs: { lang: 'en', class: 'h-full antialiased' },
      bodyAttrs: { class: 'flex h-full bg-zinc-50 dark:bg-black' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'alternate', type: 'application/rss+xml', href: '/feed.xml' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://grantstampfli.com',
    name: 'Grant Stampfli',
  },

  // Spotlight toggles a `dark` class on <html>.
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  content: {
    experimental: {
      // Node 22 ships sqlite, so no native better-sqlite3 build is needed.
      sqliteConnector: 'native',
    },
    build: {
      markdown: {
        highlight: {
          // Spotlight's code blocks are always dark.
          theme: 'github-dark',
        },
      },
    },
  },

  runtimeConfig: {
    // Server-only; set via EDGE_CONFIG / FLAGS_SECRET on Vercel.
    edgeConfig: '',
    flagsSecret: '',
    public: {
      siteUrl: 'https://grantstampfli.com',
      resumeUrl: 'https://gstampfli.com',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/articles': { prerender: true },
    '/projects': { prerender: true },
    '/speaking': { prerender: true },
    '/uses': { prerender: true },
    '/thank-you': { prerender: true },
    '/feed.xml': { prerender: true },
    '/articles/**': { isr: 3600 },
    '/projects/**': { isr: 3600 },
    '/api/**': { cors: true },
  },

  compatibilityDate: '2026-09-01',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/feed.xml'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  image: {
    // Vercel's image optimizer in production, ipx locally.
    provider: process.env.VERCEL ? 'vercel' : 'ipx',
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-og-image',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://grantstampfli.com',
    name: 'Grant Stampfli',
  },

  content: {
    experimental: {
      // Node 22 ships sqlite, so no native better-sqlite3 build is needed.
      sqliteConnector: 'native',
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
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
    '/projects': { prerender: true },
    '/projects/**': { isr: 3600 },
    '/api/**': { cors: true },
  },

  compatibilityDate: '2026-09-01',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  icon: {
    provider: 'iconify',
    serverBundle: {
      collections: ['lucide', 'simple-icons'],
    },
  },

  image: {
    // Vercel's image optimizer in production, ipx locally.
    provider: process.env.VERCEL ? 'vercel' : 'ipx',
  },
})

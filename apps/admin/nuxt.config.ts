import { fileURLToPath } from 'node:url'

/** https://nuxt.com/docs/api/configuration/nuxt-config */
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Admin',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Server-only. Every key can be overridden with NUXT_<KEY> env vars.
    adminPassword: '',
    /** Overrides CONTENT_DATABASE_URL / DATABASE_URL when set. */
    contentDatabaseUrl: '',
    storage: {
      // 'db' stores content as database rows (default when a database URL is configured),
      // 'fs' edits the files in this monorepo checkout, 'github' commits to the repository.
      driver: '',
      root: fileURLToPath(new URL('../..', import.meta.url)),
    },
    github: {
      token: '',
      repo: 'GrantStampfli/resume',
      branch: 'master',
    },
    vercelDeployHookUrl: '',
    public: {
      portfolioUrl: 'https://grantstampfli.com',
      resumeUrl: 'https://gstampfli.com',
    },
  },

  routeRules: {
    '/**': { ssr: false },
  },

  compatibilityDate: '2026-09-01',

  typescript: {
    strict: true,
    typeCheck: false,
  },

  icon: {
    provider: 'server',
    serverBundle: {
      collections: ['lucide'],
    },
  },
})

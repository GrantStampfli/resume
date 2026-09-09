// @env node

import type { H3Event } from 'h3'
import type { ContentStore } from './stores/types'
import process from 'node:process'
import { contentDatabaseUrl } from '@stampfli/content-db'
import { DbStore } from './stores/db'
import { FsStore } from './stores/fs'
import { GitHubStore } from './stores/github'

let cached: { driver: StorageDriver, store: ContentStore } | undefined

export function resolveStorageDriver(event?: H3Event): StorageDriver {
  const config = useRuntimeConfig(event)
  const configured = config.storage.driver as string

  if (configured === 'db' || configured === 'fs' || configured === 'github')
    return configured

  // A configured database wins: it is the only writable store on a read-only deployment
  // and the portfolio reads the same rows.
  if (contentDatabaseUrl())
    return 'db'

  // Otherwise commit through GitHub in production, and edit the checkout locally.
  return process.env.VERCEL || process.env.NODE_ENV === 'production' ? 'github' : 'fs'
}

export function useContentStore(event?: H3Event): { driver: StorageDriver, store: ContentStore } {
  if (cached)
    return cached

  const config = useRuntimeConfig(event)
  const driver = resolveStorageDriver(event)

  let store: ContentStore
  if (driver === 'db') {
    store = new DbStore(config.contentDatabaseUrl || undefined)
  }
  else if (driver === 'github') {
    store = new GitHubStore({
      token: config.github.token || process.env.GITHUB_TOKEN || '',
      repo: config.github.repo,
      branch: config.github.branch,
    })
  }
  else {
    store = new FsStore(config.storage.root)
  }

  cached = { driver, store }
  return cached
}

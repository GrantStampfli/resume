// @env node

import type { H3Event } from 'h3'
import type { ContentStore } from './stores/types'
import process from 'node:process'
import { FsStore } from './stores/fs'
import { GitHubStore } from './stores/github'

export type StorageDriver = 'fs' | 'github'

let cached: { driver: StorageDriver, store: ContentStore } | undefined

export function resolveStorageDriver(event?: H3Event): StorageDriver {
  const config = useRuntimeConfig(event)
  const configured = config.storage.driver as string

  if (configured === 'fs' || configured === 'github')
    return configured

  // On Vercel the filesystem is read-only, so commit through GitHub instead.
  return process.env.VERCEL || process.env.NODE_ENV === 'production' ? 'github' : 'fs'
}

export function useContentStore(event?: H3Event): { driver: StorageDriver, store: ContentStore } {
  if (cached)
    return cached

  const config = useRuntimeConfig(event)
  const driver = resolveStorageDriver(event)

  const store = driver === 'github'
    ? new GitHubStore({
        token: config.github.token || process.env.GITHUB_TOKEN || '',
        repo: config.github.repo,
        branch: config.github.branch,
      })
    : new FsStore(config.storage.root)

  cached = { driver, store }
  return cached
}

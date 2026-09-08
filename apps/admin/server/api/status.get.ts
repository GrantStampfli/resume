// @env node

import type { AdminStatus } from '#shared/types/content'
import process from 'node:process'
import { PORTFOLIO_CONTENT_DIR, useContentDatabase } from '@stampfli/content-db'
import { requireAdmin } from '../utils/auth'
import { resolveStorageDriver } from '../utils/store'

export default defineEventHandler(async (event): Promise<AdminStatus> => {
  await requireAdmin(event)

  const config = useRuntimeConfig(event)
  const storage = resolveStorageDriver(event)

  let entries: number | null = null
  let dialect: string | null = null

  if (storage === 'db') {
    const database = await useContentDatabase(config.contentDatabaseUrl ? { url: config.contentDatabaseUrl } : undefined)
    entries = await database.count(`${PORTFOLIO_CONTENT_DIR}/`)
    dialect = database.dialect
  }

  return {
    storage,
    repo: storage === 'github' ? config.github.repo : null,
    branch: storage === 'github' ? config.github.branch : null,
    dialect,
    entries,
    canBuildResume: storage === 'fs',
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    deployHookConfigured: Boolean(config.vercelDeployHookUrl),
  }
})

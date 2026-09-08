// @env node

import type { AdminStatus } from '#shared/types/content'
import process from 'node:process'
import { requireAdmin } from '../utils/auth'
import { resolveStorageDriver } from '../utils/store'

export default defineEventHandler(async (event): Promise<AdminStatus> => {
  await requireAdmin(event)

  const config = useRuntimeConfig(event)
  const storage = resolveStorageDriver(event)

  return {
    storage,
    repo: storage === 'github' ? config.github.repo : null,
    branch: storage === 'github' ? config.github.branch : null,
    canBuildResume: storage === 'fs',
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    deployHookConfigured: Boolean(config.vercelDeployHookUrl),
  }
})

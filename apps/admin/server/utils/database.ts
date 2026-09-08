// @env node

import type { ContentDatabase } from '@stampfli/content-db'
import type { H3Event } from 'h3'
import { useContentDatabase } from '@stampfli/content-db'
import { resolveStorageDriver } from './store'

/**
 * The content database, or a 400 when the admin is not running on the database driver
 * (revisions and imports only exist there).
 */
export async function requireDatabase(event: H3Event): Promise<ContentDatabase> {
  if (resolveStorageDriver(event) !== 'db')
    throw createError({ statusCode: 400, statusMessage: 'The database driver is not active' })

  const url = useRuntimeConfig(event).contentDatabaseUrl
  return useContentDatabase(url ? { url } : undefined)
}

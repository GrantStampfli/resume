// @env node

import type { ContentDbOptions } from './types'
import { ContentDatabase } from './database'

export { contentDatabaseUrl, dialectFor } from './client'
export { ContentDatabase } from './database'
export {
  EDITABLE_EXTENSIONS,
  normalizeContentPath,
  PORTFOLIO_CONTENT_DIR,
  portfolioContentKey,
  portfolioContentPath,
  RESUME_PATH,
} from './paths'
export { seedFromFiles } from './seed'
export type * from './types'

let shared: Promise<ContentDatabase> | undefined

/**
 * Opens the content database, reusing the connection for the lifetime of the process.
 * Pass options to open a separate instance (tests, scripts).
 */
export function useContentDatabase(options?: ContentDbOptions): Promise<ContentDatabase> {
  if (options)
    return ContentDatabase.open(options)

  shared ??= ContentDatabase.open()
  return shared
}

// @env node

import { PORTFOLIO_CONTENT_DIR, RESUME_PATH, seedFromFiles } from '@stampfli/content-db'
import { z } from 'zod'
import { requireAdmin } from '../../utils/auth'
import { requireDatabase } from '../../utils/database'

const schema = z.object({
  /** Replace rows that already exist. Off by default so an import never clobbers an edit. */
  overwrite: z.boolean().default(false),
})

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)

  const { overwrite } = await readValidatedBody(event, schema.parse)
  const database = await requireDatabase(event)
  const rootDir = useRuntimeConfig(event).storage.root

  const result = await seedFromFiles(database, {
    rootDir,
    paths: [PORTFOLIO_CONTENT_DIR, RESUME_PATH],
    author: user.name,
    overwrite,
  })

  return { ok: true, ...result }
})

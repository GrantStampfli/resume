// @env node

import type { ContentRevisionSummary } from '#shared/types/content'
import { z } from 'zod'
import { requireAdmin } from '../../utils/auth'
import { requireDatabase } from '../../utils/database'

const schema = z.object({
  path: z.string().min(1).max(1000),
})

export default defineEventHandler(async (event): Promise<ContentRevisionSummary[]> => {
  await requireAdmin(event)

  const { path } = await getValidatedQuery(event, schema.parse)
  const database = await requireDatabase(event)

  return (await database.revisions(path, 50)).map(revision => ({
    id: revision.id,
    path: revision.path,
    size: revision.size,
    createdAt: revision.createdAt,
    createdBy: revision.createdBy,
  }))
})

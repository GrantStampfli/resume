// @env node

import type { ContentRevision } from '#shared/types/content'
import { requireAdmin } from '../../utils/auth'
import { requireDatabase } from '../../utils/database'

export default defineEventHandler(async (event): Promise<ContentRevision> => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0)
    throw createError({ statusCode: 400, statusMessage: 'Invalid revision id' })

  const database = await requireDatabase(event)
  const revision = await database.revision(id)

  if (!revision)
    throw createError({ statusCode: 404, statusMessage: 'Revision not found' })

  return {
    id: revision.id,
    path: revision.path,
    size: revision.size,
    createdAt: revision.createdAt,
    createdBy: revision.createdBy,
    raw: revision.body,
  }
})

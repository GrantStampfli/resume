// @env node

import { RESUME_PATH } from '#shared/utils/paths'
import { requireAdmin } from '../../../utils/auth'
import { requireDatabase } from '../../../utils/database'
import { triggerDeploy, triggerResumeBuild } from '../../../utils/deploy'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0)
    throw createError({ statusCode: 400, statusMessage: 'Invalid revision id' })

  const database = await requireDatabase(event)
  const revision = await database.revision(id)

  if (!revision)
    throw createError({ statusCode: 404, statusMessage: 'Revision not found' })

  // Writing the old body forward keeps the history linear: the current body becomes a revision too.
  await database.write(revision.path, revision.body, user.name)
  triggerDeploy(`restore:${revision.path}`)

  // This endpoint only runs on the database driver, so a restored resume has no commit either.
  if (revision.path === RESUME_PATH)
    triggerResumeBuild()

  return { ok: true, path: revision.path, id }
})

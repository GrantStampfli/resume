// @env node

import type { ResumeFile } from '#shared/types/content'
import { RESUME_PATH } from '#shared/utils/paths'
import { requireAdmin } from '../../utils/auth'
import { useContentStore } from '../../utils/store'

export default defineEventHandler(async (event): Promise<ResumeFile> => {
  await requireAdmin(event)

  const { store } = useContentStore(event)
  const raw = await store.read(RESUME_PATH)

  if (raw === null)
    throw createError({ statusCode: 404, statusMessage: `${RESUME_PATH} not found` })

  const [entry] = await store.list('apps/resume-gen')

  return {
    raw,
    updatedAt: entry?.path === RESUME_PATH ? entry.updatedAt : null,
  }
})

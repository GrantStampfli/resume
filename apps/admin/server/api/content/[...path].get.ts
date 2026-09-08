// @env node

import type { ContentFile } from '#shared/types/content'
import { normalizeContentPath, PORTFOLIO_CONTENT_DIR } from '#shared/utils/paths'
import { requireAdmin } from '../../utils/auth'
import { useContentStore } from '../../utils/store'

export default defineEventHandler(async (event): Promise<ContentFile> => {
  await requireAdmin(event)

  let path: string
  try {
    path = normalizeContentPath(getRouterParam(event, 'path') ?? '')
  }
  catch (error) {
    throw createError({ statusCode: 400, statusMessage: (error as Error).message })
  }

  const { store } = useContentStore(event)
  const raw = await store.read(`${PORTFOLIO_CONTENT_DIR}/${path}`)

  if (raw === null)
    throw createError({ statusCode: 404, statusMessage: `${path} not found` })

  return { path, raw }
})

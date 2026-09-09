// @env node

import { normalizeContentPath, PORTFOLIO_CONTENT_DIR } from '#shared/utils/paths'
import { requireAdmin } from '../../utils/auth'
import { triggerDeploy } from '../../utils/deploy'
import { useContentStore } from '../../utils/store'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)

  let path: string
  try {
    path = normalizeContentPath(getRouterParam(event, 'path') ?? '')
  }
  catch (error) {
    throw createError({ statusCode: 400, statusMessage: (error as Error).message })
  }

  const { store } = useContentStore(event)
  await store.remove(`${PORTFOLIO_CONTENT_DIR}/${path}`, `content(portfolio): remove ${path} via admin`, user.name)
  triggerDeploy(`content:${path}`)

  return { ok: true, path }
})

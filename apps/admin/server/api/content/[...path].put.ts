// @env node

import { z } from 'zod'
import { normalizeContentPath, PORTFOLIO_CONTENT_DIR } from '#shared/utils/paths'
import { requireAdmin } from '../../utils/auth'
import { triggerDeploy } from '../../utils/deploy'
import { useContentStore } from '../../utils/store'

const schema = z.object({
  raw: z.string().max(500_000),
})

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)

  let path: string
  try {
    path = normalizeContentPath(getRouterParam(event, 'path') ?? '')
  }
  catch (error) {
    throw createError({ statusCode: 400, statusMessage: (error as Error).message })
  }

  const { raw } = await readValidatedBody(event, schema.parse)
  const { store, driver } = useContentStore(event)
  const fullPath = `${PORTFOLIO_CONTENT_DIR}/${path}`
  const created = (await store.read(fullPath)) === null

  await store.write(fullPath, raw.endsWith('\n') ? raw : `${raw}\n`, `content(portfolio): ${created ? 'add' : 'update'} ${path} via admin`, user.name)
  triggerDeploy(`content:${path}`)

  return { ok: true, created, driver, path }
})

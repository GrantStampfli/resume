// @env node

import { z } from 'zod'
import { RESUME_PATH } from '#shared/utils/paths'
import { requireAdmin } from '../../utils/auth'
import { triggerDeploy } from '../../utils/deploy'
import { useContentStore } from '../../utils/store'

const schema = z.object({
  raw: z.string().min(1).max(200_000),
})

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)

  const { raw } = await readValidatedBody(event, schema.parse)
  const { store, driver } = useContentStore(event)

  await store.write(RESUME_PATH, raw.endsWith('\n') ? raw : `${raw}\n`, 'chore(resume): update resume.md via admin', user.name)
  triggerDeploy('resume')

  return { ok: true, driver }
})

// @env node

import type { H3Event } from 'h3'
import type { SessionUser } from '#shared/types/content'

export async function requireAdmin(event: H3Event): Promise<SessionUser> {
  const session = await requireUserSession(event)
  const user = session.user as SessionUser | undefined

  if (user?.role !== 'admin')
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  return user
}

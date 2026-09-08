// @env node

import type { SessionUser } from '#shared/types/content'
import { Buffer } from 'node:buffer'
import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

const schema = z.object({
  password: z.string().min(1),
})

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export default defineEventHandler(async (event) => {
  const { password } = await readValidatedBody(event, schema.parse)
  const expected = useRuntimeConfig(event).adminPassword

  if (!expected)
    throw createError({ statusCode: 500, statusMessage: 'NUXT_ADMIN_PASSWORD is not configured' })

  if (!safeEqual(password, expected))
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })

  const user: SessionUser = { name: 'Grant', role: 'admin' }
  await setUserSession(event, { user, loggedInAt: Date.now() })

  return { user }
})

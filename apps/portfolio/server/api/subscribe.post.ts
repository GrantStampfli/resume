// @env node
// Newsletter sign-ups. Stored in the content database when one is configured, otherwise logged
// so the form still works in a local checkout.

import { contentDatabaseUrl, useContentDatabase } from '@stampfli/content-db'
import { z } from 'zod'

const schema = z.object({
  email: z.string().trim().email().max(200),
  /** Honeypot: real people never fill this in. */
  website: z.string().max(0).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.safeParse)

  if (!body.success)
    throw createError({ statusCode: 400, statusMessage: 'Please enter a valid email address' })

  if (!contentDatabaseUrl()) {
    console.warn('[subscribe] no database configured; not storing', body.data.email)
    return { ok: true, stored: false }
  }

  const database = await useContentDatabase()
  const { created } = await database.subscribe(body.data.email, 'portfolio')

  return { ok: true, stored: true, created }
})

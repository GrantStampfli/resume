// @env node
// Contact form delivery. Sends through the Resend API when configured; otherwise logs and reports so.

import process from 'node:process'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.safeParse)

  if (!body.success)
    throw createError({ statusCode: 400, statusMessage: 'Please check the form and try again' })

  const { name, email, subject, message } = body.data
  const config = useRuntimeConfig(event)
  const apiKey = config.resendApiKey || process.env.RESEND_API_KEY
  const to = config.contactTo
  const from = config.contactFrom

  if (!apiKey || !to || !from) {
    console.warn('[contact] RESEND_API_KEY / NUXT_CONTACT_TO / NUXT_CONTACT_FROM not set; message not delivered', { name, email, subject })
    return { ok: true, delivered: false }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  })

  if (!response.ok) {
    console.error('[contact] Resend responded', response.status, await response.text())
    throw createError({ statusCode: 502, statusMessage: 'Mail delivery failed, please email me directly' })
  }

  return { ok: true, delivered: true }
})

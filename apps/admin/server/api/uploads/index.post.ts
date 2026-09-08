// @env node

import type { UploadedAsset } from '#shared/types/content'
// Uploads an image to Vercel Blob so it can be referenced from portfolio content.
import process from 'node:process'
import { put } from '@vercel/blob'
import { slugify } from '#shared/utils/paths'
import { requireAdmin } from '../../utils/auth'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'])

export default defineEventHandler(async (event): Promise<UploadedAsset> => {
  await requireAdmin(event)

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    throw createError({ statusCode: 400, statusMessage: 'BLOB_READ_WRITE_TOKEN is not configured' })

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file' && part.filename)

  if (!file?.filename)
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })

  if (file.data.byteLength > MAX_BYTES)
    throw createError({ statusCode: 413, statusMessage: 'File is larger than 8 MB' })

  if (!file.type || !ALLOWED.has(file.type))
    throw createError({ statusCode: 415, statusMessage: `Unsupported file type: ${file.type}` })

  const extension = file.filename.includes('.') ? file.filename.slice(file.filename.lastIndexOf('.')) : ''
  const base = slugify(file.filename.replace(extension, '')) || 'upload'

  const blob = await put(`portfolio/${base}${extension.toLowerCase()}`, file.data, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  })

  return {
    url: blob.url,
    pathname: blob.pathname,
    size: file.data.byteLength,
    uploadedAt: new Date().toISOString(),
  }
})

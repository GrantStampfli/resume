// @env node

import type { UploadedAsset } from '#shared/types/content'
import process from 'node:process'
import { list } from '@vercel/blob'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event): Promise<UploadedAsset[]> => {
  await requireAdmin(event)

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return []

  const { blobs } = await list({ prefix: 'portfolio/', limit: 200 })

  return blobs
    .map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt.toISOString(),
    }))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
})

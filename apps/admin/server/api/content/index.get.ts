// @env node

import type { ContentEntry } from '#shared/types/content'
import matter from 'gray-matter'
import { EDITABLE_EXTENSIONS, PORTFOLIO_CONTENT_DIR } from '#shared/utils/paths'
import { requireAdmin } from '../../utils/auth'
import { useContentStore } from '../../utils/store'

export default defineEventHandler(async (event): Promise<ContentEntry[]> => {
  await requireAdmin(event)

  const { store } = useContentStore(event)
  const entries = await store.list(PORTFOLIO_CONTENT_DIR)
  const prefix = `${PORTFOLIO_CONTENT_DIR}/`

  const editable = entries.filter(entry => EDITABLE_EXTENSIONS.some(extension => entry.path.endsWith(extension)))

  return Promise.all(editable.map(async (entry) => {
    const path = entry.path.slice(prefix.length)
    let title: string | null = null

    if (entry.path.endsWith('.md')) {
      const raw = await store.read(entry.path)
      if (raw !== null) {
        const data = matter(raw).data as Record<string, unknown>
        title = typeof data.title === 'string' ? data.title : null
      }
    }

    return {
      path,
      name: path.split('/').pop() ?? path,
      size: entry.size,
      title,
      updatedAt: entry.updatedAt,
    }
  }))
})

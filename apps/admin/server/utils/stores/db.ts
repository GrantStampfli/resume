// @env node

import type { ContentDatabase } from '@stampfli/content-db'
import type { ContentStore, StoredEntry } from './types'
import { useContentDatabase } from '@stampfli/content-db'

/**
 * Stores content as rows in a database rather than as files. This is the driver used in
 * production, where the deployment filesystem is read-only; the portfolio reads the same
 * rows when it builds.
 */
export class DbStore implements ContentStore {
  private database: Promise<ContentDatabase>

  constructor(url?: string) {
    this.database = useContentDatabase(url ? { url } : undefined)
  }

  async list(directory: string): Promise<StoredEntry[]> {
    const database = await this.database
    const entries = await database.list(`${directory.replace(/\/$/, '')}/`)

    return entries.map(entry => ({
      path: entry.path,
      size: entry.size,
      updatedAt: entry.updatedAt,
    }))
  }

  async read(path: string): Promise<string | null> {
    return (await this.database).read(path)
  }

  async write(path: string, content: string, _message: string, author?: string): Promise<void> {
    await (await this.database).write(path, content, author ?? null)
  }

  async remove(path: string, _message: string, author?: string): Promise<void> {
    await (await this.database).remove(path, author ?? null)
  }
}

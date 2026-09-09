// @env node
// Nuxt Content collection sources backed by the content database, so the site builds from the
// rows the admin writes. Without a database URL the collections read files as usual.

import { resolve } from 'node:path'
import { defineCollectionSource } from '@nuxt/content'
import {
  contentDatabaseUrl,
  PORTFOLIO_CONTENT_DIR,
  portfolioContentKey,
  portfolioContentPath,
  seedFromFiles,
  useContentDatabase,
} from '@stampfli/content-db'

export const usingDatabase = Boolean(contentDatabaseUrl())

/** `articles/*.md` → matches `articles/a.md` but not `articles/nested/a.md`. */
function matcher(pattern: string): (key: string) => boolean {
  const source = pattern
    .split('*')
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^/]*')

  const regex = new RegExp(`^${source}$`)
  return key => regex.test(key)
}

let seeding: Promise<void> | undefined

/**
 * Copies the checked-in files into an empty database once, so a fresh deployment renders the
 * content that is in the repository instead of nothing.
 */
async function seedOnce(rootDir: string): Promise<void> {
  seeding ??= (async () => {
    const database = await useContentDatabase()
    await database.migrate()

    if (await database.count(`${PORTFOLIO_CONTENT_DIR}/`) > 0)
      return

    // nuxt.config lives in apps/portfolio, so the repository root is two levels up.
    const repoRoot = resolve(rootDir, '../..')
    const { imported } = await seedFromFiles(database, {
      rootDir: repoRoot,
      paths: [PORTFOLIO_CONTENT_DIR],
      author: 'seed',
    })
    console.warn(`[content-db] seeded ${imported} files into an empty database`)
  })()

  return seeding
}

export function databaseSource(pattern: string) {
  const matches = matcher(pattern)

  return defineCollectionSource({
    async prepare({ rootDir }) {
      await seedOnce(rootDir)
    },
    async getKeys() {
      const database = await useContentDatabase()
      const entries = await database.list(`${PORTFOLIO_CONTENT_DIR}/`)

      return entries
        .map(entry => portfolioContentKey(entry.path))
        .filter((key): key is string => Boolean(key) && matches(key!))
    },
    async getItem(key) {
      const database = await useContentDatabase()
      return await database.read(portfolioContentPath(key)) ?? ''
    },
  })
}

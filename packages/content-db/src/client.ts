// @env node

import type { Database } from 'db0'
import type { ContentDbOptions, Dialect } from './types'
import { mkdirSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import process from 'node:process'
import { createDatabase } from 'db0'

const DEFAULT_SQLITE_PATH = '.data/content.db'

/**
 * The connection string for the content database, or undefined when none is configured
 * (in which case callers fall back to reading files from the checkout).
 */
export function contentDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  const url = env.CONTENT_DATABASE_URL || env.NUXT_CONTENT_DATABASE_URL || env.DATABASE_URL || env.POSTGRES_URL
  return url && url.trim() ? url.trim() : undefined
}

export function dialectFor(url: string): Dialect {
  return /^postgres(?:ql)?:\/\//.test(url) ? 'postgres' : 'sqlite'
}

/**
 * db0's node-sqlite connector only treats `name: ':memory:'` as in-memory; a `path` of
 * `:memory:` would create a file with that name.
 */
function sqliteOptions(url: string, rootDir: string): { name: string } | { path: string } {
  const raw = url.replace(/^file:(?:\/\/)?/, '') || DEFAULT_SQLITE_PATH

  if (raw === ':memory:')
    return { name: ':memory:' }

  const path = isAbsolute(raw) ? raw : resolve(rootDir, raw)
  mkdirSync(dirname(path), { recursive: true })
  return { path }
}

export async function connect(options: ContentDbOptions = {}): Promise<{ db: Database, dialect: Dialect }> {
  const url = options.url ?? contentDatabaseUrl() ?? `file:${DEFAULT_SQLITE_PATH}`
  const dialect = dialectFor(url)

  if (dialect === 'postgres') {
    const { default: postgresql } = await import('db0/connectors/postgresql')
    return { db: createDatabase(postgresql({ url })), dialect }
  }

  const { default: sqlite } = await import('db0/connectors/node-sqlite')
  return { db: createDatabase(sqlite(sqliteOptions(url, options.rootDir ?? process.cwd()))), dialect }
}

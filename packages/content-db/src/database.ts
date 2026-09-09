// @env node

import type { Database } from 'db0'
import type {
  ContentDbOptions,
  ContentEntry,
  ContentEntryWithBody,
  ContentRevision,
  ContentRevisionWithBody,
  Dialect,
  Subscriber,
} from './types'
import { Buffer } from 'node:buffer'
import { connect } from './client'

interface EntryRow {
  path: string
  body?: string
  size: number | string
  updated_at: string
  updated_by: string | null
}

interface RevisionRow {
  id: number | string
  path: string
  body?: string
  size: number | string
  created_at: string
  created_by: string | null
}

function toEntry(row: EntryRow): ContentEntry {
  return {
    path: row.path,
    size: Number(row.size),
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  }
}

function toRevision(row: RevisionRow): ContentRevision {
  return {
    id: Number(row.id),
    path: row.path,
    size: Number(row.size),
    createdAt: row.created_at,
    createdBy: row.created_by,
  }
}

/**
 * The content of the site, stored in a database rather than in files. Keys are repository
 * relative paths so the resume markdown and the portfolio content share one table.
 */
export class ContentDatabase {
  private migrated: Promise<void> | undefined

  private constructor(readonly db: Database, readonly dialect: Dialect) {}

  static async open(options: ContentDbOptions = {}): Promise<ContentDatabase> {
    const { db, dialect } = await connect(options)
    return new ContentDatabase(db, dialect)
  }

  /** Creates the tables once per instance; safe to call before every query. */
  migrate(): Promise<void> {
    this.migrated ??= this.createTables()
    return this.migrated
  }

  private async createTables(): Promise<void> {
    const autoId = this.dialect === 'postgres'
      ? 'id SERIAL PRIMARY KEY'
      : 'id INTEGER PRIMARY KEY AUTOINCREMENT'

    await this.db.exec(`CREATE TABLE IF NOT EXISTS content_entries (
      path TEXT PRIMARY KEY,
      body TEXT NOT NULL,
      size INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      updated_by TEXT
    )`)

    await this.db.exec(`CREATE TABLE IF NOT EXISTS content_revisions (
      ${autoId},
      path TEXT NOT NULL,
      body TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      created_by TEXT
    )`)

    await this.db.exec(`CREATE INDEX IF NOT EXISTS content_revisions_path ON content_revisions (path)`)

    await this.db.exec(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      email TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      source TEXT
    )`)
  }

  async count(prefix = ''): Promise<number> {
    await this.migrate()
    const { rows } = await this.db.sql<{ rows: { total: number | string }[] }>`
      SELECT COUNT(*) AS total FROM content_entries WHERE path LIKE ${`${prefix}%`}
    `
    return Number(rows?.[0]?.total ?? 0)
  }

  /** Entries below a repository relative prefix, without their bodies. */
  async list(prefix = ''): Promise<ContentEntry[]> {
    await this.migrate()
    const { rows } = await this.db.sql<{ rows: EntryRow[] }>`
      SELECT path, size, updated_at, updated_by
      FROM content_entries
      WHERE path LIKE ${`${prefix}%`}
      ORDER BY path
    `
    return (rows ?? []).map(toEntry)
  }

  async read(path: string): Promise<string | null> {
    await this.migrate()
    const { rows } = await this.db.sql<{ rows: { body: string }[] }>`
      SELECT body FROM content_entries WHERE path = ${path}
    `
    return rows?.[0]?.body ?? null
  }

  async readEntry(path: string): Promise<ContentEntryWithBody | null> {
    await this.migrate()
    const { rows } = await this.db.sql<{ rows: EntryRow[] }>`
      SELECT path, body, size, updated_at, updated_by FROM content_entries WHERE path = ${path}
    `
    const row = rows?.[0]
    return row ? { ...toEntry(row), body: row.body ?? '' } : null
  }

  /** Inserts or replaces an entry and keeps the previous body as a revision. */
  async write(path: string, body: string, author: string | null = null): Promise<{ created: boolean }> {
    await this.migrate()

    const previous = await this.readEntry(path)
    const now = new Date().toISOString()
    const size = Buffer.byteLength(body, 'utf8')

    if (previous) {
      await this.db.sql`
        INSERT INTO content_revisions (path, body, size, created_at, created_by)
        VALUES (${previous.path}, ${previous.body}, ${previous.size}, ${previous.updatedAt}, ${previous.updatedBy})
      `
    }

    await this.db.sql`
      INSERT INTO content_entries (path, body, size, updated_at, updated_by)
      VALUES (${path}, ${body}, ${size}, ${now}, ${author})
      ON CONFLICT (path) DO UPDATE SET
        body = ${body},
        size = ${size},
        updated_at = ${now},
        updated_by = ${author}
    `

    return { created: !previous }
  }

  /** Removes an entry, keeping its last body as a revision so it can be restored. */
  async remove(path: string, author: string | null = null): Promise<{ removed: boolean }> {
    await this.migrate()

    const previous = await this.readEntry(path)
    if (!previous)
      return { removed: false }

    await this.db.sql`
      INSERT INTO content_revisions (path, body, size, created_at, created_by)
      VALUES (${previous.path}, ${previous.body}, ${previous.size}, ${previous.updatedAt}, ${author})
    `
    await this.db.sql`DELETE FROM content_entries WHERE path = ${path}`

    return { removed: true }
  }

  async revisions(path: string, limit = 20): Promise<ContentRevision[]> {
    await this.migrate()
    const { rows } = await this.db.sql<{ rows: RevisionRow[] }>`
      SELECT id, path, size, created_at, created_by
      FROM content_revisions
      WHERE path = ${path}
      ORDER BY id DESC
      LIMIT ${limit}
    `
    return (rows ?? []).map(toRevision)
  }

  async revision(id: number): Promise<ContentRevisionWithBody | null> {
    await this.migrate()
    const { rows } = await this.db.sql<{ rows: RevisionRow[] }>`
      SELECT id, path, body, size, created_at, created_by FROM content_revisions WHERE id = ${id}
    `
    const row = rows?.[0]
    return row ? { ...toRevision(row), body: row.body ?? '' } : null
  }

  async subscribe(email: string, source: string | null = null): Promise<{ created: boolean }> {
    await this.migrate()

    const address = email.trim().toLowerCase()
    const { rows } = await this.db.sql<{ rows: { email: string }[] }>`
      SELECT email FROM newsletter_subscribers WHERE email = ${address}
    `
    if (rows?.length)
      return { created: false }

    await this.db.sql`
      INSERT INTO newsletter_subscribers (email, created_at, source)
      VALUES (${address}, ${new Date().toISOString()}, ${source})
    `
    return { created: true }
  }

  async subscribers(limit = 200): Promise<Subscriber[]> {
    await this.migrate()
    const { rows } = await this.db.sql<{ rows: { email: string, created_at: string, source: string | null }[] }>`
      SELECT email, created_at, source FROM newsletter_subscribers ORDER BY created_at DESC LIMIT ${limit}
    `
    return (rows ?? []).map(row => ({ email: row.email, createdAt: row.created_at, source: row.source }))
  }
}

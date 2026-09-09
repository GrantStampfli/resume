export type Dialect = 'sqlite' | 'postgres'

export interface ContentEntry {
  /** Path relative to the repository root. */
  path: string
  size: number
  updatedAt: string
  updatedBy: string | null
}

export interface ContentEntryWithBody extends ContentEntry {
  body: string
}

export interface ContentRevision {
  id: number
  path: string
  size: number
  createdAt: string
  createdBy: string | null
}

export interface ContentRevisionWithBody extends ContentRevision {
  body: string
}

export interface Subscriber {
  email: string
  createdAt: string
  source: string | null
}

export interface ContentDbOptions {
  /**
   * Connection string. `postgres://…` and `postgresql://…` use the PostgreSQL connector,
   * anything else (including `file:…` and a bare path) uses Node's built-in SQLite.
   * Defaults to the first of CONTENT_DATABASE_URL, DATABASE_URL, POSTGRES_URL.
   */
  url?: string
  /** Where a relative SQLite file is resolved from. Defaults to the working directory. */
  rootDir?: string
}

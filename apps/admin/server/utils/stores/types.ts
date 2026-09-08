export interface StoredEntry {
  /** Path relative to the repository root. */
  path: string
  size: number | null
  updatedAt: string | null
}

export interface ContentStore {
  /** Lists files below a directory (recursively). */
  list: (directory: string) => Promise<StoredEntry[]>
  /** Returns the file contents, or null when it does not exist. */
  read: (path: string) => Promise<string | null>
  write: (path: string, content: string, message: string) => Promise<void>
  remove: (path: string, message: string) => Promise<void>
}

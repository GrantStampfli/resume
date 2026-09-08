// @env node

import type { Dirent } from 'node:fs'
import type { ContentStore, StoredEntry } from './types'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'

/**
 * Edits files directly in the monorepo checkout. Used for local development where the
 * changes are then committed like any other change.
 */
export class FsStore implements ContentStore {
  private readonly root: string

  constructor(root: string) {
    this.root = resolve(root)
  }

  private absolute(path: string): string {
    const target = resolve(this.root, path)

    if (target !== this.root && !target.startsWith(this.root + sep))
      throw new Error(`Path escapes repository root: ${path}`)

    return target
  }

  async list(directory: string): Promise<StoredEntry[]> {
    const base = this.absolute(directory)
    const entries: StoredEntry[] = []

    const walk = async (current: string): Promise<void> => {
      let children: Dirent[]
      try {
        children = await readdir(current, { withFileTypes: true })
      }
      catch {
        return
      }

      for (const child of children) {
        const full = join(current, child.name)
        if (child.isDirectory()) {
          await walk(full)
        }
        else if (child.isFile()) {
          const info = await stat(full)
          entries.push({
            path: relative(this.root, full).split(sep).join('/'),
            size: info.size,
            updatedAt: info.mtime.toISOString(),
          })
        }
      }
    }

    await walk(base)
    return entries.sort((a, b) => a.path.localeCompare(b.path))
  }

  async read(path: string): Promise<string | null> {
    try {
      return await readFile(this.absolute(path), 'utf8')
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT')
        return null
      throw error
    }
  }

  async write(path: string, content: string): Promise<void> {
    const target = this.absolute(path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, content, 'utf8')
  }

  async remove(path: string): Promise<void> {
    await rm(this.absolute(path), { force: true })
  }
}

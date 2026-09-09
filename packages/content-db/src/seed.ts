// @env node

import type { Dirent } from 'node:fs'
import type { ContentDatabase } from './database'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import { EDITABLE_EXTENSIONS } from './paths'

async function walk(directory: string): Promise<string[]> {
  let entries: Dirent<string>[]
  try {
    entries = await readdir(directory, { withFileTypes: true, encoding: 'utf8' })
  }
  catch {
    return []
  }

  const files: string[] = []
  for (const entry of entries) {
    const full = join(directory, entry.name)
    if (entry.isDirectory())
      files.push(...await walk(full))
    else if (entry.isFile() && EDITABLE_EXTENSIONS.some(extension => entry.name.endsWith(extension)))
      files.push(full)
  }
  return files
}

/**
 * Copies files from the checkout into the database, keyed by their path relative to `rootDir`.
 * Existing rows are left alone unless `overwrite` is set, so a seed never clobbers an edit.
 */
export async function seedFromFiles(
  database: ContentDatabase,
  options: { rootDir: string, paths: string[], author?: string, overwrite?: boolean },
): Promise<{ imported: number, skipped: number }> {
  const root = resolve(options.rootDir)
  let imported = 0
  let skipped = 0

  for (const candidate of options.paths) {
    const absolute = resolve(root, candidate)
    const info = await stat(absolute).catch(() => null)
    if (!info)
      continue

    const files = info.isDirectory() ? await walk(absolute) : [absolute]

    for (const file of files) {
      const key = relative(root, file).split(sep).join('/')

      if (!options.overwrite && await database.read(key) !== null) {
        skipped++
        continue
      }

      await database.write(key, await readFile(file, 'utf8'), options.author ?? 'seed')
      imported++
    }
  }

  return { imported, skipped }
}

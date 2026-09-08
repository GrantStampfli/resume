import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ContentDatabase } from './database'
import { seedFromFiles } from './seed'

describe('contentDatabase', () => {
  let database: ContentDatabase

  beforeEach(async () => {
    database = await ContentDatabase.open({ url: 'file::memory:' })
    await database.migrate()
  })

  it('writes, reads and lists entries', async () => {
    expect(await database.read('a.md')).toBeNull()

    const { created } = await database.write('apps/portfolio/content/a.md', '# Hello', 'grant')
    expect(created).toBe(true)

    expect(await database.read('apps/portfolio/content/a.md')).toBe('# Hello')

    const entries = await database.list('apps/portfolio/content/')
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ path: 'apps/portfolio/content/a.md', size: 7, updatedBy: 'grant' })
  })

  it('keeps the previous body as a revision on every write', async () => {
    await database.write('a.md', 'first')
    await database.write('a.md', 'second')
    await database.write('a.md', 'third')

    const revisions = await database.revisions('a.md')
    expect(revisions.map(revision => revision.size)).toEqual([6, 5])

    const restored = await database.revision(revisions[1]!.id)
    expect(restored?.body).toBe('first')
    expect(await database.read('a.md')).toBe('third')
  })

  it('keeps a revision when an entry is deleted', async () => {
    await database.write('a.md', 'only')

    expect(await database.remove('a.md')).toEqual({ removed: true })
    expect(await database.remove('a.md')).toEqual({ removed: false })

    expect(await database.read('a.md')).toBeNull()
    expect(await database.revisions('a.md')).toHaveLength(1)
  })

  it('counts entries below a prefix', async () => {
    await database.write('apps/portfolio/content/articles/a.md', 'a')
    await database.write('apps/portfolio/content/articles/b.md', 'b')
    await database.write('apps/resume-gen/resume.md', 'r')

    expect(await database.count('apps/portfolio/content/')).toBe(2)
    expect(await database.count()).toBe(3)
  })

  it('records newsletter subscribers once', async () => {
    expect(await database.subscribe('Grant@Example.com ', 'home')).toEqual({ created: true })
    expect(await database.subscribe('grant@example.com')).toEqual({ created: false })

    const subscribers = await database.subscribers()
    expect(subscribers).toHaveLength(1)
    expect(subscribers[0]).toMatchObject({ email: 'grant@example.com', source: 'home' })
  })
})

describe('seedFromFiles', () => {
  let directory: string
  let database: ContentDatabase

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'content-db-'))
    database = await ContentDatabase.open({ url: 'file::memory:' })
    await database.migrate()
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('imports files and never clobbers an existing edit', async () => {
    await writeFile(join(directory, 'a.md'), 'from disk')
    await writeFile(join(directory, 'ignored.txt'), 'not editable')

    expect(await seedFromFiles(database, { rootDir: directory, paths: ['.'] }))
      .toEqual({ imported: 1, skipped: 0 })
    expect(await database.read('a.md')).toBe('from disk')

    await database.write('a.md', 'edited in the admin')

    expect(await seedFromFiles(database, { rootDir: directory, paths: ['.'] }))
      .toEqual({ imported: 0, skipped: 1 })
    expect(await database.read('a.md')).toBe('edited in the admin')

    expect(await seedFromFiles(database, { rootDir: directory, paths: ['.'], overwrite: true }))
      .toEqual({ imported: 1, skipped: 0 })
    expect(await database.read('a.md')).toBe('from disk')
  })
})

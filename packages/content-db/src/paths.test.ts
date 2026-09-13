import { describe, expect, it } from 'vitest'
import { normalizeContentPath, portfolioContentKey, portfolioContentPath } from './paths'

describe('normalizeContentPath', () => {
  it('accepts editable files and tidies separators', () => {
    expect(normalizeContentPath('articles/hello.md')).toBe('articles/hello.md')
    expect(normalizeContentPath('/articles//hello.md')).toBe('articles/hello.md')
    expect(normalizeContentPath('articles\\hello.md')).toBe('articles/hello.md')
    expect(normalizeContentPath('speaking.yml')).toBe('speaking.yml')
  })

  it('rejects traversal, including percent-encoded traversal', () => {
    for (const input of [
      '../package.json',
      'articles/../../package.json',
      '%2e%2e%2f%2e%2e%2fpackage.json',
      'articles%2f..%2f..%2fpackage.json',
      './hello.md',
    ]) {
      expect(() => normalizeContentPath(input), input).toThrow('Invalid path')
    }
  })

  it('rejects malformed encoding, control characters and empty input', () => {
    expect(() => normalizeContentPath('%E0%A4%A.md')).toThrow('Invalid path')
    expect(() => normalizeContentPath('articles/hel%00lo.md')).toThrow('Invalid path')
    expect(() => normalizeContentPath('   ')).toThrow('Empty path')
  })

  it('rejects file types that are not editable', () => {
    expect(() => normalizeContentPath('notes.txt')).toThrow('can be edited')
    expect(() => normalizeContentPath('script.sh')).toThrow('can be edited')
  })
})

describe('portfolio paths', () => {
  it('round-trips between a key and a repository path', () => {
    const path = portfolioContentPath('articles/hello.md')
    expect(path).toBe('apps/portfolio/content/articles/hello.md')
    expect(portfolioContentKey(path)).toBe('articles/hello.md')
    expect(portfolioContentKey('apps/resume-gen/resume.yml')).toBeNull()
  })
})

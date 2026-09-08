/** Paths of the files the admin manages, relative to the monorepo root. */
export const RESUME_PATH = 'apps/resume-gen/resume.md'
export const PORTFOLIO_CONTENT_DIR = 'apps/portfolio/content'

export const EDITABLE_EXTENSIONS = ['.md', '.yml', '.yaml', '.json'] as const

/**
 * Normalises a user supplied content path and rejects anything that escapes the content directory.
 */
export function normalizeContentPath(input: string): string {
  const cleaned = input
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/{2,}/g, '/')
    .trim()

  if (!cleaned)
    throw new Error('Empty path')

  if (cleaned.split('/').some(segment => segment === '.' || segment === '..' || segment === ''))
    throw new Error('Invalid path')

  if (!EDITABLE_EXTENSIONS.some(extension => cleaned.endsWith(extension)))
    throw new Error(`Only ${EDITABLE_EXTENSIONS.join(', ')} files can be edited`)

  return cleaned
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

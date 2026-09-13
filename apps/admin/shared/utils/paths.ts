/** Paths of the files the admin manages, relative to the monorepo root. */
export const RESUME_PATH = 'apps/resume-gen/resume.yml'
export const PORTFOLIO_CONTENT_DIR = 'apps/portfolio/content'

export const EDITABLE_EXTENSIONS = ['.md', '.yml', '.yaml', '.json'] as const

/**
 * Normalises a caller supplied path and rejects anything that escapes its directory or is not
 * an editable file type.
 *
 * Route params arrive percent-encoded (h3 does not decode them), so `%2e%2e%2f` has to be
 * decoded before the `..` check or it would pass as an ordinary filename.
 */
export function normalizeContentPath(input: string): string {
  let decoded: string
  try {
    decoded = decodeURIComponent(input)
  }
  catch {
    throw new Error('Invalid path')
  }

  const cleaned = decoded
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/{2,}/g, '/')
    .trim()

  if (!cleaned)
    throw new Error('Empty path')

  if (cleaned.split('/').some(segment => segment === '.' || segment === '..' || segment === ''))
    throw new Error('Invalid path')

  // eslint-disable-next-line no-control-regex -- NUL and friends have no place in a path
  if (/[\u0000-\u001F]/.test(cleaned))
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

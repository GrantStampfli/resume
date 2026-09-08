export function formatDate(dateString: string): string {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** `2020-05` → `May 2020`, `2019` → `2019`, anything else unchanged. */
export function formatPeriod(value: string): string {
  if (!/^\d{4}(?:-\d{2})?$/.test(value))
    return value
  const [year, month] = value.split('-')
  if (!month)
    return year!
  return new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]!.toUpperCase())
    .join('')
}

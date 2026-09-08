// @env node

// Feature flags backed by Vercel Edge Config, with local defaults when it is not configured.
import process from 'node:process'
import { createClient } from '@vercel/edge-config'

export interface SiteFlags {
  /** Show the "hire me" call to action on the home page. */
  hiring: boolean
  /** Temporarily hide the projects section (e.g. during a content migration). */
  hideProjects: boolean
}

const defaults: SiteFlags = {
  hiring: false,
  hideProjects: false,
}

export async function getSiteFlags(): Promise<SiteFlags> {
  const connection = useRuntimeConfig().edgeConfig || process.env.EDGE_CONFIG

  if (!connection)
    return defaults

  try {
    const client = createClient(connection)
    const stored = await client.get<Partial<SiteFlags>>('siteFlags')
    return { ...defaults, ...stored }
  }
  catch (error) {
    console.error('[flags] failed to read Edge Config, using defaults', error)
    return defaults
  }
}

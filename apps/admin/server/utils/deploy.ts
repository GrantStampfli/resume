// @env node

import { waitUntil } from '@vercel/functions'

/**
 * Pings the Vercel deploy hook (if configured) without delaying the response.
 * With the GitHub storage driver the commit itself already triggers a deploy, so this is
 * mainly useful for the fs driver or when the portfolio is not connected to git.
 */
export function triggerDeploy(reason: string): void {
  const url = useRuntimeConfig().vercelDeployHookUrl

  if (!url)
    return

  const ping = fetch(url, { method: 'POST' })
    .then((response) => {
      if (!response.ok)
        console.warn(`[deploy] hook (${reason}) responded with ${response.status}`)
    })
    .catch(error => console.error('[deploy] hook failed', error))

  waitUntil(ping)
}

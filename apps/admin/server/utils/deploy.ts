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

/**
 * Rebuilds the GitHub Pages resume. With the database driver the save is a row rather than a
 * commit, so nothing else would trigger the deploy workflow; with the other drivers the commit
 * (or the local edit) already covers it.
 */
export function triggerResumeBuild(): void {
  const { github } = useRuntimeConfig()

  if (!github.token) {
    console.warn('[deploy] resume saved to the database but NUXT_GITHUB_TOKEN is not set; the published resume will not rebuild')
    return
  }

  const dispatch = fetch(`https://api.github.com/repos/${github.repo}/dispatches`, {
    method: 'POST',
    headers: {
      'accept': 'application/vnd.github+json',
      'authorization': `Bearer ${github.token}`,
      'content-type': 'application/json',
      'x-github-api-version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: 'resume-updated' }),
  })
    .then(async (response) => {
      if (!response.ok)
        console.warn(`[deploy] resume dispatch responded with ${response.status}: ${await response.text()}`)
    })
    .catch(error => console.error('[deploy] resume dispatch failed', error))

  waitUntil(dispatch)
}

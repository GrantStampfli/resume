// @env node

import type { ContentStore, StoredEntry } from './types'
import { Buffer } from 'node:buffer'

export interface GitHubStoreOptions {
  token: string
  /** `owner/name` */
  repo: string
  branch: string
}

interface TreeItem {
  path: string
  type: 'blob' | 'tree' | 'commit'
  size?: number
}

interface ContentsResponse {
  sha: string
  content: string
  encoding: string
}

/**
 * Reads and writes files through the GitHub Contents API, so every save is a commit on the
 * configured branch. Used in production where the deployment filesystem is read-only.
 */
export class GitHubStore implements ContentStore {
  private readonly api = 'https://api.github.com'

  constructor(private readonly options: GitHubStoreOptions) {
    if (!options.token)
      throw new Error('GitHub storage requires NUXT_GITHUB_TOKEN')
    if (!/^[\w.-]+\/[\w.-]+$/.test(options.repo))
      throw new Error(`Invalid GitHub repository: ${options.repo}`)
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<{ status: number, data: T }> {
    const response = await fetch(`${this.api}${path}`, {
      ...init,
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${this.options.token}`,
        'x-github-api-version': '2022-11-28',
        'user-agent': 'stampfli-admin',
        ...(init.body ? { 'content-type': 'application/json' } : {}),
        ...init.headers,
      },
    })

    if (response.status === 404)
      return { status: 404, data: null as T }

    if (!response.ok)
      throw new Error(`GitHub API ${init.method ?? 'GET'} ${path} failed: ${response.status} ${await response.text()}`)

    return { status: response.status, data: (await response.json()) as T }
  }

  private contentsPath(path: string): string {
    return `/repos/${this.options.repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`
  }

  private async sha(path: string): Promise<string | null> {
    const { status, data } = await this.request<ContentsResponse>(`${this.contentsPath(path)}?ref=${encodeURIComponent(this.options.branch)}`)
    return status === 404 ? null : data.sha
  }

  async list(directory: string): Promise<StoredEntry[]> {
    const prefix = `${directory.replace(/\/$/, '')}/`
    const { status, data } = await this.request<{ tree: TreeItem[] }>(
      `/repos/${this.options.repo}/git/trees/${encodeURIComponent(this.options.branch)}?recursive=1`,
    )

    if (status === 404)
      return []

    return data.tree
      .filter(item => item.type === 'blob' && item.path.startsWith(prefix))
      .map(item => ({ path: item.path, size: item.size ?? null, updatedAt: null }))
      .sort((a, b) => a.path.localeCompare(b.path))
  }

  async read(path: string): Promise<string | null> {
    const { status, data } = await this.request<ContentsResponse>(`${this.contentsPath(path)}?ref=${encodeURIComponent(this.options.branch)}`)

    if (status === 404)
      return null

    if (data.encoding !== 'base64')
      throw new Error(`Unexpected encoding for ${path}: ${data.encoding}`)

    return Buffer.from(data.content, 'base64').toString('utf8')
  }

  async write(path: string, content: string, message: string): Promise<void> {
    const sha = await this.sha(path)

    await this.request(this.contentsPath(path), {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf8').toString('base64'),
        branch: this.options.branch,
        ...(sha ? { sha } : {}),
      }),
    })
  }

  async remove(path: string, message: string): Promise<void> {
    const sha = await this.sha(path)

    if (!sha)
      return

    await this.request(this.contentsPath(path), {
      method: 'DELETE',
      body: JSON.stringify({ message, sha, branch: this.options.branch }),
    })
  }
}

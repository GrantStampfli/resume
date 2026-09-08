export interface ContentEntry {
  /** Path relative to the portfolio content directory, e.g. `projects/koho.md`. */
  path: string
  name: string
  size: number | null
  title: string | null
  updatedAt: string | null
}

export interface ContentFile {
  path: string
  raw: string
}

export interface ResumeFile {
  raw: string
  updatedAt: string | null
}

export interface AdminStatus {
  storage: 'fs' | 'github'
  repo: string | null
  branch: string | null
  canBuildResume: boolean
  blobConfigured: boolean
  deployHookConfigured: boolean
}

export interface UploadedAsset {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export interface SessionUser {
  name: string
  role: 'admin'
}

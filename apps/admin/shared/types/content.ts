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

export type StorageDriver = 'db' | 'fs' | 'github'

export interface AdminStatus {
  storage: StorageDriver
  repo: string | null
  branch: string | null
  /** Database dialect when the database driver is active. */
  dialect: string | null
  /** Number of portfolio content rows when the database driver is active. */
  entries: number | null
  canBuildResume: boolean
  blobConfigured: boolean
  deployHookConfigured: boolean
}

export interface ContentRevisionSummary {
  id: number
  path: string
  size: number
  createdAt: string
  createdBy: string | null
}

export interface ContentRevision extends ContentRevisionSummary {
  raw: string
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

import type { AdminStatus } from '#shared/types/content'

export function useAdminStatus() {
  return useFetch<AdminStatus>('/api/status', {
    key: 'admin-status',
    default: (): AdminStatus => ({
      storage: 'fs',
      repo: null,
      branch: null,
      dialect: null,
      entries: null,
      canBuildResume: false,
      blobConfigured: false,
      deployHookConfigured: false,
    }),
  })
}

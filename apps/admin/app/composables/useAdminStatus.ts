import type { AdminStatus } from '#shared/types/content'

export function useAdminStatus() {
  return useFetch<AdminStatus>('/api/status', {
    key: 'admin-status',
    default: () => ({
      storage: 'fs' as const,
      repo: null,
      branch: null,
      canBuildResume: false,
      blobConfigured: false,
      deployHookConfigured: false,
    }),
  })
}

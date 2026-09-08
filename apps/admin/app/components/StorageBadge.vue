<script setup lang="ts">
import type { AdminStatus } from '#shared/types/content'

interface Props {
  status: AdminStatus
}

const props = defineProps<Props>()

const badge = computed(() => {
  switch (props.status.storage) {
    case 'db':
      return {
        icon: 'i-lucide-database',
        label: `Saving to the ${props.status.dialect ?? 'content'} database`,
        color: 'primary' as const,
      }
    case 'github':
      return {
        icon: 'i-lucide-git-commit-horizontal',
        label: `Commits to ${props.status.repo}@${props.status.branch}`,
        color: 'primary' as const,
      }
    default:
      return {
        icon: 'i-lucide-hard-drive',
        label: 'Editing local checkout',
        color: 'neutral' as const,
      }
  }
})
</script>

<template>
  <UBadge :icon="badge.icon" :label="badge.label" :color="badge.color" variant="subtle" />
</template>

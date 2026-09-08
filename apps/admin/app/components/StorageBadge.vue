<script setup lang="ts">
import type { AdminStatus } from '#shared/types/content'

interface Props {
  status: AdminStatus
}

const props = defineProps<Props>()

const label = computed(() => props.status.storage === 'github'
  ? `Commits to ${props.status.repo}@${props.status.branch}`
  : 'Editing local checkout')
</script>

<template>
  <UBadge
    :icon="status.storage === 'github' ? 'i-lucide-git-commit-horizontal' : 'i-lucide-hard-drive'"
    :label="label"
    :color="status.storage === 'github' ? 'primary' : 'neutral'"
    variant="subtle"
  />
</template>

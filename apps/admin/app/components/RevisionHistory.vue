<script setup lang="ts">
import type { ContentRevision, ContentRevisionSummary } from '#shared/types/content'

interface Props {
  /** Repository relative path of the entry, e.g. `apps/portfolio/content/articles/a.md`. */
  path: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ restored: [] }>()

const open = defineModel<boolean>('open', { default: false })

const toast = useToast()
const preview = shallowRef<ContentRevision | null>(null)
const busy = shallowRef(false)

const { data: revisions, refresh, status } = await useFetch<ContentRevisionSummary[]>('/api/revisions', {
  query: computed(() => ({ path: props.path })),
  default: () => [],
  immediate: false,
})

watch(open, (value) => {
  if (value)
    refresh()
  else
    preview.value = null
})

async function show(revision: ContentRevisionSummary): Promise<void> {
  preview.value = await $fetch<ContentRevision>(`/api/revisions/${revision.id}`)
}

async function restore(revision: ContentRevisionSummary): Promise<void> {
  busy.value = true
  try {
    await $fetch(`/api/revisions/${revision.id}/restore`, { method: 'POST' })
    toast.add({ title: 'Revision restored', icon: 'i-lucide-history', color: 'success' })
    open.value = false
    emit('restored')
  }
  catch (error) {
    const message = (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? String(error)
    toast.add({ title: 'Could not restore', description: message, color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    busy.value = false
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}
</script>

<template>
  <USlideover v-model:open="open" title="History" :description="path">
    <template #body>
      <div v-if="status === 'pending'" class="text-sm text-muted">
        Loading…
      </div>

      <UAlert
        v-else-if="!revisions.length"
        icon="i-lucide-history"
        color="neutral"
        variant="subtle"
        title="No earlier versions"
        description="Every save keeps the previous body here."
      />

      <ul v-else class="divide-y divide-default">
        <li v-for="revision in revisions" :key="revision.id" class="py-3 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-medium text-highlighted">
              {{ formatDate(revision.createdAt) }}
            </p>
            <p class="text-xs text-muted">
              {{ revision.size }} bytes<span v-if="revision.createdBy"> · {{ revision.createdBy }}</span>
            </p>
          </div>
          <div class="flex gap-1 shrink-0">
            <UButton label="View" size="xs" color="neutral" variant="ghost" @click="show(revision)" />
            <UButton label="Restore" size="xs" variant="subtle" :loading="busy" @click="restore(revision)" />
          </div>
        </li>
      </ul>

      <UCard v-if="preview" class="mt-4">
        <template #header>
          <span class="text-sm font-semibold">{{ formatDate(preview.createdAt) }}</span>
        </template>
        <pre class="text-xs whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">{{ preview.raw }}</pre>
      </UCard>
    </template>
  </USlideover>
</template>

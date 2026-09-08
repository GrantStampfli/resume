<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ContentEntry } from '#shared/types/content'
import { projectTemplate } from '#shared/utils/frontmatter'
import { slugify } from '#shared/utils/paths'

useSeoMeta({ title: 'Portfolio content' })

const toast = useToast()
const { data: status } = await useAdminStatus()
const { data: entries, refresh } = await useFetch<ContentEntry[]>('/api/content', { default: () => [] })

const columns: TableColumn<ContentEntry>[] = [
  { accessorKey: 'path', header: 'File' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'updatedAt', header: 'Updated' },
  { id: 'actions' },
]

const groups = computed(() => {
  const projects = entries.value.filter(entry => entry.path.startsWith('projects/'))
  const pages = entries.value.filter(entry => !entry.path.startsWith('projects/'))
  return [
    { label: 'Pages', items: pages },
    { label: 'Projects', items: projects },
  ]
})

const creating = shallowRef(false)
const newTitle = shallowRef('')
const newSlug = computed(() => slugify(newTitle.value))
const busy = shallowRef(false)

async function createProject(): Promise<void> {
  if (!newSlug.value)
    return

  busy.value = true
  try {
    const path = `projects/${newSlug.value}.md`
    await $fetch(contentUrl(path), { method: 'PUT', body: { raw: projectTemplate(newTitle.value.trim()) } })
    creating.value = false
    newTitle.value = ''
    await navigateTo(`/content/${path}`)
  }
  catch (error) {
    toast.add({ title: 'Could not create project', description: describe(error), color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    busy.value = false
  }
}

async function remove(entry: ContentEntry): Promise<void> {
  // eslint-disable-next-line no-alert -- a native confirm is fine for a single-user admin
  if (!window.confirm(`Delete ${entry.path}? This cannot be undone.`))
    return

  try {
    await $fetch(contentUrl(entry.path), { method: 'DELETE' })
    await refresh()
    toast.add({ title: `Deleted ${entry.path}`, icon: 'i-lucide-trash-2', color: 'success' })
  }
  catch (error) {
    toast.add({ title: 'Delete failed', description: describe(error), color: 'error', icon: 'i-lucide-triangle-alert' })
  }
}

// Typed as a plain string so $fetch does not narrow the method to the GET handler of the catch-all route.
function contentUrl(path: string): string {
  return `/api/content/${path}`
}

function describe(error: unknown): string {
  return (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? String(error)
}

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleString() : '—'
}
</script>

<template>
  <UDashboardPanel id="content">
    <template #header>
      <UDashboardNavbar title="Portfolio content">
        <template #right>
          <StorageBadge :status="status" />
          <UButton label="New project" icon="i-lucide-plus" @click="creating = true" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-for="group in groups" :key="group.label" class="mb-10">
        <h2 class="font-semibold mb-3">
          {{ group.label }}
        </h2>

        <UTable :data="group.items" :columns="columns" :empty="`No ${group.label.toLowerCase()} yet`">
          <template #path-cell="{ row }">
            <NuxtLink :to="`/content/${row.original.path}`" class="font-mono text-sm text-primary hover:underline">
              {{ row.original.path }}
            </NuxtLink>
          </template>
          <template #title-cell="{ row }">
            {{ row.original.title ?? '—' }}
          </template>
          <template #updatedAt-cell="{ row }">
            <span class="text-muted text-sm">{{ formatDate(row.original.updatedAt) }}</span>
          </template>
          <template #actions-cell="{ row }">
            <div class="flex justify-end gap-1">
              <UButton :to="`/content/${row.original.path}`" icon="i-lucide-pencil" size="xs" color="neutral" variant="ghost" aria-label="Edit" />
              <UButton icon="i-lucide-trash-2" size="xs" color="error" variant="ghost" aria-label="Delete" @click="remove(row.original)" />
            </div>
          </template>
        </UTable>
      </div>

      <UModal v-model:open="creating" title="New project" description="Creates a markdown file under content/projects.">
        <template #body>
          <UFormField label="Title" name="title" :help="newSlug ? `projects/${newSlug}.md` : undefined">
            <UInput v-model="newTitle" placeholder="My next project" autofocus class="w-full" @keydown.enter="createProject" />
          </UFormField>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2 w-full">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="creating = false" />
            <UButton label="Create" :disabled="!newSlug" :loading="busy" @click="createProject" />
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

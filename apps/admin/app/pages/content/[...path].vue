<script setup lang="ts">
import type { ContentFile } from '#shared/types/content'
import { PORTFOLIO_CONTENT_DIR } from '#shared/utils/paths'

const route = useRoute()
const toast = useToast()

const path = computed(() => (Array.isArray(route.params.path) ? route.params.path : [route.params.path]).join('/'))

useSeoMeta({ title: () => path.value })

const { data: status } = await useAdminStatus()
// Typed as a plain string so $fetch does not narrow the method to the GET handler of the catch-all route.
const url = computed<string>(() => `/api/content/${path.value}`)
const { data: file, refresh, error } = await useFetch<ContentFile>(url)

if (error.value) {
  throw createError({ statusCode: error.value.statusCode ?? 404, statusMessage: error.value.statusMessage ?? 'Not found', fatal: true })
}

const draft = shallowRef(file.value?.raw ?? '')
watch(file, value => draft.value = value?.raw ?? '')

const dirty = computed(() => draft.value !== (file.value?.raw ?? ''))
const saving = shallowRef(false)
const isMarkdown = computed(() => path.value.endsWith('.md'))
const historyOpen = shallowRef(false)
const repoPath = computed(() => `${PORTFOLIO_CONTENT_DIR}/${path.value}`)

async function save(): Promise<void> {
  saving.value = true
  try {
    await $fetch(url.value, { method: 'PUT', body: { raw: draft.value } })
    await refresh()
    toast.add({ title: `Saved ${path.value}`, icon: 'i-lucide-check', color: 'success' })
  }
  catch (failure) {
    const message = (failure as { data?: { statusMessage?: string } }).data?.statusMessage ?? String(failure)
    toast.add({ title: 'Save failed', description: message, color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    saving.value = false
  }
}

onBeforeRouteLeave(() => {
  // eslint-disable-next-line no-alert -- a native confirm is fine for a single-user admin
  if (dirty.value && !window.confirm('You have unsaved changes. Leave anyway?'))
    return false
})
</script>

<template>
  <UDashboardPanel id="content-editor">
    <template #header>
      <UDashboardNavbar :title="path">
        <template #leading>
          <UButton to="/content" icon="i-lucide-arrow-left" color="neutral" variant="ghost" aria-label="Back" />
        </template>
        <template #right>
          <StorageBadge :status="status" />
          <UButton
            v-if="status.storage === 'db'"
            label="History"
            icon="i-lucide-history"
            color="neutral"
            variant="ghost"
            @click="historyOpen = true"
          />
          <UButton label="Save" icon="i-lucide-save" :disabled="!dirty" :loading="saving" @click="save" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <MarkdownEditor v-model="draft" :previewable="isMarkdown" />

      <RevisionHistory v-if="status.storage === 'db'" v-model:open="historyOpen" :path="repoPath" @restored="refresh()" />
    </template>
  </UDashboardPanel>
</template>

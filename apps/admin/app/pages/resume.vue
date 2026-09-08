<script setup lang="ts">
import type { ResumeFile } from '#shared/types/content'

useSeoMeta({ title: 'Resume' })

const toast = useToast()
const { data: status } = await useAdminStatus()
const { data: resume, refresh } = await useFetch<ResumeFile>('/api/resume')

const draft = shallowRef(resume.value?.raw ?? '')
watch(resume, value => draft.value = value?.raw ?? '')

const dirty = computed(() => draft.value !== (resume.value?.raw ?? ''))
const saving = shallowRef(false)
const building = shallowRef(false)
const buildOutput = shallowRef<string | null>(null)

async function save(): Promise<void> {
  saving.value = true
  try {
    await $fetch('/api/resume', { method: 'PUT', body: { raw: draft.value } })
    await refresh()
    toast.add({ title: 'Resume saved', icon: 'i-lucide-check', color: 'success' })
  }
  catch (error) {
    toast.add({ title: 'Save failed', description: describe(error), color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    saving.value = false
  }
}

async function build(): Promise<void> {
  building.value = true
  buildOutput.value = null
  try {
    const result = await $fetch<{ output: string }>('/api/resume/build', { method: 'POST' })
    buildOutput.value = result.output
    toast.add({ title: 'Resume built into apps/resume-gen/dist', icon: 'i-lucide-check', color: 'success' })
  }
  catch (error) {
    buildOutput.value = (error as { data?: { data?: string } }).data?.data ?? describe(error)
    toast.add({ title: 'Build failed', color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    building.value = false
  }
}

function describe(error: unknown): string {
  return (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? String(error)
}

onBeforeRouteLeave(() => {
  // eslint-disable-next-line no-alert -- a native confirm is fine for a single-user admin
  if (dirty.value && !window.confirm('You have unsaved changes. Leave anyway?'))
    return false
})
</script>

<template>
  <UDashboardPanel id="resume">
    <template #header>
      <UDashboardNavbar title="Resume">
        <template #right>
          <StorageBadge :status="status" />
          <UButton
            v-if="status.canBuildResume"
            label="Build HTML + PDF"
            icon="i-lucide-hammer"
            color="neutral"
            variant="outline"
            :loading="building"
            @click="build"
          />
          <UButton
            label="Save"
            icon="i-lucide-save"
            :disabled="!dirty"
            :loading="saving"
            @click="save"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UAlert
        class="mb-4"
        icon="i-lucide-info"
        color="neutral"
        variant="subtle"
        title="PHP Markdown Extra syntax"
        description="Definition lists (Term / : definition) and header ids ({#skills}) are rendered by the generator. The preview approximates them."
      />

      <MarkdownEditor v-model="draft" placeholder="# Your Name" />

      <UCard v-if="buildOutput" class="mt-4">
        <template #header>
          <span class="font-semibold text-sm">Build output</span>
        </template>
        <pre class="text-xs whitespace-pre-wrap font-mono">{{ buildOutput }}</pre>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

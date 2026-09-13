<script setup lang="ts">
import type { ResumeData } from '@stampfli/resume-md'
import type { ResumeFile } from '#shared/types/content'
import {
  emptyResume,
  parseResumeYaml,
  serializeResume,
  stringifyResumeYaml,
} from '@stampfli/resume-md'
import { RESUME_PATH } from '#shared/utils/paths'

useSeoMeta({ title: 'Resume' })

const toast = useToast()
const { render } = useMarkdown()
const { data: status } = await useAdminStatus()
const { data: resume, refresh } = await useFetch<ResumeFile>('/api/resume')

function loadData(raw: string | undefined): ResumeData {
  if (!raw?.trim())
    return emptyResume()
  try {
    if (/^\s*#/m.test(raw)) {
      toast.add({
        title: 'Legacy markdown detected',
        description: 'Save once to convert this row to structured YAML.',
        color: 'warning',
        icon: 'i-lucide-info',
      })
      return emptyResume()
    }
    return parseResumeYaml(raw)
  }
  catch (error) {
    toast.add({
      title: 'Could not parse resume.yml',
      description: error instanceof Error ? error.message : String(error),
      color: 'error',
      icon: 'i-lucide-triangle-alert',
    })
    return emptyResume()
  }
}

const draft = ref<ResumeData>(loadData(resume.value?.raw))
const rawYaml = ref(stringifyResumeYaml(draft.value))
const mode = ref<'form' | 'yaml'>('form')
const savedYaml = computed(() => resume.value?.raw ?? '')
const dirty = computed(() => {
  const current = mode.value === 'yaml' ? rawYaml.value : stringifyResumeYaml(draft.value)
  return current.trim() !== savedYaml.value.trim()
})
const saving = ref(false)
const building = ref(false)
const buildOutput = ref<string | null>(null)
const historyOpen = ref(false)

watch(resume, (value) => {
  draft.value = loadData(value?.raw)
  rawYaml.value = value?.raw?.trim() ? value.raw : stringifyResumeYaml(draft.value)
})

const previewHtml = computed(() => {
  try {
    const data = mode.value === 'yaml' ? parseResumeYaml(rawYaml.value) : draft.value
    return render(serializeResume(data))
  }
  catch {
    return '<p class="text-muted">Fix the YAML to see a preview.</p>'
  }
})

function syncFormFromYaml(): void {
  draft.value = parseResumeYaml(rawYaml.value)
  mode.value = 'form'
}

function syncYamlFromForm(): void {
  rawYaml.value = stringifyResumeYaml(draft.value)
  mode.value = 'yaml'
}

function setMode(next: 'form' | 'yaml'): void {
  if (next === mode.value)
    return
  try {
    if (next === 'form')
      syncFormFromYaml()
    else
      syncYamlFromForm()
  }
  catch (error) {
    toast.add({
      title: 'Cannot switch editor',
      description: error instanceof Error ? error.message : String(error),
      color: 'error',
      icon: 'i-lucide-triangle-alert',
    })
  }
}

async function save(): Promise<void> {
  saving.value = true
  try {
    const raw = mode.value === 'yaml'
      ? stringifyResumeYaml(parseResumeYaml(rawYaml.value))
      : stringifyResumeYaml(draft.value)
    await $fetch('/api/resume', { method: 'PUT', body: { raw } })
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

function addSkill(): void {
  draft.value = {
    ...draft.value,
    skills: [...draft.value.skills, { name: 'New skill', description: 'Describe the skill.' }],
  }
}

function removeSkill(index: number): void {
  draft.value = {
    ...draft.value,
    skills: draft.value.skills.filter((_, i) => i !== index),
  }
}

function addExperience(): void {
  draft.value = {
    ...draft.value,
    experience: [...draft.value.experience, {
      organisation: 'Company',
      role: 'Role',
      dates: '2020-Present',
      summary: 'What you did.',
    }],
  }
}

function removeExperience(index: number): void {
  draft.value = {
    ...draft.value,
    experience: draft.value.experience.filter((_, i) => i !== index),
  }
}

const technicalText = computed({
  get: () => draft.value.technical.join('\n'),
  set: (value: string) => {
    draft.value = {
      ...draft.value,
      technical: value.split('\n').map(line => line.trim()).filter(Boolean),
    }
  },
})

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
            v-if="status.storage === 'db'"
            label="History"
            icon="i-lucide-history"
            color="neutral"
            variant="ghost"
            @click="historyOpen = true"
          />
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
        title="Structured resume.yml"
        :description="`Edit fields below or switch to YAML. Saved to ${RESUME_PATH}; the generator compiles it to Markdown Extra for HTML/PDF.`"
      />

      <div class="flex items-center justify-between gap-2 mb-4">
        <UFieldGroup size="xs">
          <UButton
            label="Form"
            icon="i-lucide-layout-list"
            :color="mode === 'form' ? 'primary' : 'neutral'"
            :variant="mode === 'form' ? 'solid' : 'outline'"
            @click="setMode('form')"
          />
          <UButton
            label="YAML"
            icon="i-lucide-code-xml"
            :color="mode === 'yaml' ? 'primary' : 'neutral'"
            :variant="mode === 'yaml' ? 'solid' : 'outline'"
            @click="setMode('yaml')"
          />
        </UFieldGroup>
        <span class="text-xs text-muted">{{ dirty ? 'Unsaved changes' : 'Saved' }}</span>
      </div>

      <div class="grid gap-4 lg:grid-cols-2 min-h-[60vh]">
        <div class="space-y-4">
          <template v-if="mode === 'yaml'">
            <UTextarea
              v-model="rawYaml"
              :rows="28"
              autoresize
              spellcheck="false"
              class="w-full"
              :ui="{ base: 'font-mono text-sm leading-6 min-h-[60vh]' }"
            />
          </template>

          <template v-else>
            <UCard>
              <template #header>
                <span class="font-semibold text-sm">Identity</span>
              </template>
              <div class="grid gap-3 sm:grid-cols-2">
                <UFormField label="Name">
                  <UInput v-model="draft.name" />
                </UFormField>
                <UFormField label="Title">
                  <UInput v-model="draft.title" />
                </UFormField>
                <UFormField label="PDF filename">
                  <UInput v-model="draft.pdf" />
                </UFormField>
                <UFormField label="Email">
                  <UInput v-model="draft.contact.email" type="email" />
                </UFormField>
                <UFormField label="Phone">
                  <UInput v-model="draft.contact.phone" />
                </UFormField>
                <UFormField label="Phone link">
                  <UInput v-model="draft.contact.phoneHref" placeholder="tel:+1..." />
                </UFormField>
                <UFormField label="LinkedIn">
                  <UInput v-model="draft.contact.linkedin" placeholder="handle" />
                </UFormField>
                <UFormField label="GitHub">
                  <UInput v-model="draft.contact.github" placeholder="handle" />
                </UFormField>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <span class="font-semibold text-sm">Profile</span>
              </template>
              <UTextarea v-model="draft.profile" :rows="6" autoresize />
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center justify-between gap-2">
                  <span class="font-semibold text-sm">Skills</span>
                  <UButton size="xs" icon="i-lucide-plus" label="Add" variant="outline" @click="addSkill" />
                </div>
              </template>
              <div class="space-y-3">
                <div v-for="(skill, index) in draft.skills" :key="index" class="grid gap-2 sm:grid-cols-[12rem_1fr_auto]">
                  <UInput v-model="skill.name" placeholder="Skill" />
                  <UTextarea v-model="skill.description" :rows="2" autoresize />
                  <UButton icon="i-lucide-trash" color="error" variant="ghost" @click="removeSkill(index)" />
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <span class="font-semibold text-sm">Technical (one per line)</span>
              </template>
              <UTextarea v-model="technicalText" :rows="6" autoresize class="font-mono text-sm" />
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center justify-between gap-2">
                  <span class="font-semibold text-sm">Experience</span>
                  <UButton size="xs" icon="i-lucide-plus" label="Add" variant="outline" @click="addExperience" />
                </div>
              </template>
              <div class="space-y-4">
                <div v-for="(job, index) in draft.experience" :key="index" class="space-y-2 border-b border-default pb-4 last:border-0 last:pb-0">
                  <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <div class="grid gap-2 sm:grid-cols-2">
                      <UInput v-model="job.organisation" placeholder="Organisation" />
                      <UInput v-model="job.role" placeholder="Role" />
                      <UInput v-model="job.dates" placeholder="Dates" class="sm:col-span-2" />
                    </div>
                    <UButton icon="i-lucide-trash" color="error" variant="ghost" @click="removeExperience(index)" />
                  </div>
                  <UTextarea v-model="job.summary" :rows="4" autoresize />
                </div>
              </div>
            </UCard>
          </template>
        </div>

        <UCard :ui="{ body: 'max-h-[75vh] overflow-y-auto' }">
          <template #header>
            <span class="font-semibold text-sm">Preview</span>
          </template>
          <!-- eslint-disable-next-line vue/no-v-html -- trusted: the admin's own resume content -->
          <div class="markdown-preview text-sm" v-html="previewHtml" />
        </UCard>
      </div>

      <RevisionHistory v-if="status.storage === 'db'" v-model:open="historyOpen" :path="RESUME_PATH" @restored="refresh()" />

      <UCard v-if="buildOutput" class="mt-4">
        <template #header>
          <span class="font-semibold text-sm">Build output</span>
        </template>
        <pre class="text-xs whitespace-pre-wrap font-mono">{{ buildOutput }}</pre>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

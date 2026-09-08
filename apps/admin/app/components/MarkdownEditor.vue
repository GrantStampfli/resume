<script setup lang="ts">
import { stripFrontmatter } from '#shared/utils/frontmatter'

interface Props {
  /** Hide the preview pane. */
  previewable?: boolean
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  previewable: true,
  placeholder: 'Write markdown…',
})

const model = defineModel<string>({ required: true })

const { render } = useMarkdown()
const view = shallowRef<'split' | 'edit' | 'preview'>('split')

const html = computed(() => render(stripFrontmatter(model.value)))

const views = [
  { value: 'edit', icon: 'i-lucide-pencil', label: 'Edit' },
  { value: 'split', icon: 'i-lucide-columns-2', label: 'Split' },
  { value: 'preview', icon: 'i-lucide-eye', label: 'Preview' },
] as const

const stats = computed(() => {
  const words = model.value.trim().split(/\s+/).filter(Boolean).length
  const lines = model.value.split('\n').length
  return `${words} words · ${lines} lines`
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs text-muted">{{ stats }}</span>
      <UFieldGroup v-if="previewable" size="xs">
        <UButton
          v-for="option in views"
          :key="option.value"
          :icon="option.icon"
          :label="option.label"
          :color="view === option.value ? 'primary' : 'neutral'"
          :variant="view === option.value ? 'solid' : 'outline'"
          @click="view = option.value"
        />
      </UFieldGroup>
    </div>

    <div
      class="grid gap-4 min-h-[60vh]"
      :class="view === 'split' && previewable ? 'lg:grid-cols-2' : 'grid-cols-1'"
    >
      <UTextarea
        v-if="view !== 'preview' || !previewable"
        v-model="model"
        :placeholder="placeholder"
        :rows="28"
        autoresize
        spellcheck="false"
        class="w-full"
        :ui="{ base: 'font-mono text-sm leading-6 min-h-[60vh]' }"
      />

      <UCard
        v-if="previewable && view !== 'edit'"
        :ui="{ body: 'max-h-[75vh] overflow-y-auto' }"
      >
        <!-- eslint-disable-next-line vue/no-v-html -- trusted: the admin's own markdown -->
        <div class="markdown-preview text-sm" v-html="html" />
      </UCard>
    </div>
  </div>
</template>

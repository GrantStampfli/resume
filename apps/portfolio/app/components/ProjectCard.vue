<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

interface Props {
  project: ProjectsCollectionItem
}

const props = defineProps<Props>()

const year = computed(() => new Date(props.project.date).getFullYear())
const tags = computed(() => (props.project.tags ?? []).slice(0, 3))
</script>

<template>
  <UPageCard
    :title="project.title"
    :description="project.description"
    :to="project.path"
    variant="subtle"
    spotlight
  >
    <template v-if="project.image" #header>
      <NuxtImg
        :src="project.image"
        :alt="project.title"
        class="w-full aspect-video object-cover rounded-t-lg"
        sizes="320px sm:400px"
        loading="lazy"
      />
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-2 text-xs text-muted">
        <div class="flex flex-wrap gap-1">
          <UBadge v-for="tag in tags" :key="tag" :label="tag" size="sm" color="neutral" variant="outline" />
        </div>
        <span>{{ year }}</span>
      </div>
    </template>
  </UPageCard>
</template>

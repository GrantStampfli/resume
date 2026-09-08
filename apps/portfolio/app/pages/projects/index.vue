<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all())

const tags = computed(() => {
  const all = new Set<string>()
  for (const project of projects.value ?? []) {
    for (const tag of project.tags ?? [])
      all.add(tag)
  }
  return [...all].sort()
})

const selectedTag = shallowRef<string | null>(null)

const filtered = computed(() => {
  if (!selectedTag.value)
    return projects.value ?? []
  return (projects.value ?? []).filter(project => (project.tags ?? []).includes(selectedTag.value!))
})

useSeoMeta({
  title: 'Projects',
  description: 'Selected projects and open source work.',
})
</script>

<template>
  <UPage>
    <UPageHeader title="Projects" description="Selected projects and open source work." />

    <UPageBody>
      <div v-if="tags.length" class="flex flex-wrap gap-2 mb-8">
        <UButton
          label="All"
          size="sm"
          :color="selectedTag ? 'neutral' : 'primary'"
          :variant="selectedTag ? 'subtle' : 'solid'"
          @click="selectedTag = null"
        />
        <UButton
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          size="sm"
          :color="selectedTag === tag ? 'primary' : 'neutral'"
          :variant="selectedTag === tag ? 'solid' : 'subtle'"
          @click="selectedTag = tag"
        />
      </div>

      <UPageGrid v-if="filtered.length">
        <ProjectCard v-for="project in filtered" :key="project.path" :project="project" />
      </UPageGrid>
      <UAlert
        v-else
        icon="i-lucide-folder-open"
        title="Nothing here yet"
        description="Add markdown files under content/projects to list them."
        color="neutral"
        variant="subtle"
      />
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

interface Props {
  projects: ProjectsCollectionItem[]
}

defineProps<Props>()
</script>

<template>
  <section id="work" class="scroll-mt-16 py-20 sm:py-28">
    <UContainer>
      <SectionHeading title="Some recent projects" subtitle="Mostly related to JavaScript" />

      <UPageGrid v-if="projects.length">
        <ProjectCard v-for="project in projects" :key="project.path" :project="project" />
      </UPageGrid>
      <UAlert
        v-else
        icon="i-lucide-folder-open"
        title="No projects yet"
        description="Add markdown files under content/projects, or create one from the admin."
        color="neutral"
        variant="subtle"
      />

      <div class="mt-10 text-center">
        <UButton to="/projects" label="All projects" trailing-icon="i-lucide-arrow-right" color="neutral" variant="subtle" size="lg" />
      </div>
    </UContainer>
  </section>
</template>

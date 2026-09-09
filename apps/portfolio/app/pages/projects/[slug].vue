<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () =>
  queryCollection('projects').path(route.path).first())

if (!project.value || project.value.draft)
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })

const stack = computed(() => project.value?.stack ?? [])

useSeoMeta({
  title: project.value.title,
  description: project.value.description,
  ogTitle: project.value.title,
  ogDescription: project.value.description,
})

defineOgImageComponent('Site', {
  title: project.value.title,
  description: project.value.description,
})
</script>

<template>
  <ArticleLayout v-if="project" :title="project.title" :date="project.date" back-to="/projects" back-label="Go back to projects">
    <template #meta>
      <p class="mt-4 text-base text-zinc-600 dark:text-zinc-400">
        {{ project.description }}
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
        <NuxtLink v-if="project.url" :to="project.url" target="_blank" external class="group flex items-center text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200">
          <IconsLinkIcon class="h-6 w-6 flex-none fill-zinc-400 transition group-hover:fill-teal-500" />
          <span class="ml-2">Visit site</span>
        </NuxtLink>
        <NuxtLink v-if="project.repo" :to="project.repo" target="_blank" external class="group flex items-center text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200">
          <IconsGitHubIcon class="h-6 w-6 flex-none fill-zinc-400 transition group-hover:fill-teal-500" />
          <span class="ml-2">Source</span>
        </NuxtLink>
      </div>
      <ul v-if="stack.length" class="mt-6 flex flex-wrap gap-2">
        <li v-for="item in stack" :key="item" class="rounded-full bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-900/5 dark:bg-zinc-800/50 dark:text-zinc-300 dark:ring-white/10">
          {{ item }}
        </li>
      </ul>
    </template>
    <ContentRenderer :value="project" />
  </ArticleLayout>
</template>

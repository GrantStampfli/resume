<script setup lang="ts">
const [{ data: page }, { data: projects }] = await Promise.all([
  useAsyncData('projects-page', () => queryCollection('projectsPage').first()),
  useAsyncData('projects', () =>
    queryCollection('projects')
      .where('draft', '=', false)
      .order('date', 'DESC')
      .all()),
])

const title = computed(() => page.value?.title ?? 'Things I’ve made trying to put my dent in the universe.')
const intro = computed(() => page.value?.intro ?? '')

function linkFor(project: { url?: string, repo?: string, path: string }): { href: string, label: string } {
  const href = project.url ?? project.repo ?? project.path
  if (!/^https?:/.test(href))
    return { href, label: 'Read more' }
  return { href, label: new URL(href).hostname.replace(/^www\./, '') }
}

useSeoMeta({
  title: 'Projects',
  description: intro,
})

defineOgImageComponent('Site', {
  title: 'Projects',
  description: title.value,
})
</script>

<template>
  <SimpleLayout :title="title" :intro="intro">
    <ul role="list" class="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      <AppCard v-for="project in projects ?? []" :key="project.path" as="li">
        <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
          <img v-if="project.logo ?? project.image" :src="project.logo ?? project.image" alt="" class="h-8 w-8 rounded-full object-cover">
          <span v-else class="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{{ initials(project.title) }}</span>
        </div>
        <h2 class="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
          <CardLink :href="project.path">
            {{ project.title }}
          </CardLink>
        </h2>
        <CardDescription>{{ project.description }}</CardDescription>
        <p class="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
          <IconsLinkIcon class="h-6 w-6 flex-none" />
          <span class="ml-2">{{ linkFor(project).label }}</span>
        </p>
      </AppCard>
    </ul>
  </SimpleLayout>
</template>

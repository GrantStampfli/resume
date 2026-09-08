<script setup lang="ts">
const appConfig = useAppConfig()
const config = useRuntimeConfig()

const { data: page } = await useAsyncData('home', () => queryCollection('pages').path('/').first())

const { data: featured } = await useAsyncData('featured-projects', () =>
  queryCollection('projects')
    .where('featured', '=', true)
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(3)
    .all())

useSeoMeta({
  title: page.value?.title ?? 'Home',
  description: page.value?.description ?? appConfig.site.tagline,
  ogTitle: appConfig.site.name,
  ogDescription: page.value?.description ?? appConfig.site.tagline,
})

defineOgImageComponent('Site', {
  title: appConfig.site.name,
  description: page.value?.description ?? appConfig.site.tagline,
})
</script>

<template>
  <div>
    <UPageHero
      :headline="page?.headline"
      :title="page?.title ?? appConfig.site.name"
      :description="page?.description ?? appConfig.site.tagline"
      :links="page?.links ?? [
        { label: 'View projects', to: '/projects', trailingIcon: 'i-lucide-arrow-right' },
        { label: 'Resume', to: config.public.resumeUrl, target: '_blank', color: 'neutral', variant: 'outline', icon: 'i-lucide-file-text' },
      ]"
    />

    <UPageSection
      v-if="page?.body"
      :ui="{ container: 'py-8 sm:py-12 lg:py-16' }"
    >
      <ContentRenderer :value="page" class="prose dark:prose-invert max-w-none" />
    </UPageSection>

    <UPageSection
      title="Featured work"
      description="A few things I have built recently."
      :links="[{ label: 'All projects', to: '/projects', trailingIcon: 'i-lucide-arrow-right', color: 'neutral', variant: 'subtle' }]"
    >
      <UPageGrid v-if="featured?.length">
        <ProjectCard v-for="project in featured" :key="project.path" :project="project" />
      </UPageGrid>
      <UAlert
        v-else
        icon="i-lucide-folder-open"
        title="No featured projects yet"
        description="Mark a project as featured in the admin to show it here."
        color="neutral"
        variant="subtle"
      />
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () =>
  queryCollection('projects').path(route.path).first())

if (!project.value || project.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const { data: surround } = await useAsyncData(`project-${route.params.slug}-surround`, () =>
  queryCollectionItemSurroundings('projects', route.path, { fields: ['title', 'description'] }))

const stack = computed(() => project.value?.stack ?? [])

const formattedDate = computed(() =>
  new Date(project.value!.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }))

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
  <UPage v-if="project">
    <UPageHeader :title="project.title" :description="project.description" :headline="formattedDate">
      <template #links>
        <UButton
          v-if="project.url"
          :to="project.url"
          target="_blank"
          label="Visit"
          icon="i-lucide-external-link"
          color="neutral"
          variant="outline"
          size="sm"
        />
        <UButton
          v-if="project.repo"
          :to="project.repo"
          target="_blank"
          label="Source"
          icon="i-simple-icons-github"
          color="neutral"
          variant="outline"
          size="sm"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <div v-if="stack.length" class="flex flex-wrap gap-2 mb-8">
        <UBadge v-for="item in stack" :key="item" :label="item" color="neutral" variant="subtle" />
      </div>

      <NuxtImg
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        class="rounded-lg mb-8 w-full"
        sizes="100vw md:768px lg:1024px"
      />

      <ContentRenderer :value="project" class="prose dark:prose-invert max-w-none" />

      <USeparator class="my-10" />

      <UContentSurround :surround="surround ?? []" />
    </UPageBody>
  </UPage>
</template>

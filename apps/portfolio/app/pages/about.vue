<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => queryCollection('pages').path('/about').first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
})

defineOgImageComponent('Site', {
  title: page.value.title,
  description: page.value.description,
})
</script>

<template>
  <UPage>
    <UPageHeader :headline="page?.headline" :title="page?.title" :description="page?.description" />

    <UPageBody>
      <ContentRenderer v-if="page" :value="page" class="prose dark:prose-invert max-w-none" />
    </UPageBody>
  </UPage>
</template>

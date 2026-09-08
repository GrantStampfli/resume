<script setup lang="ts">
const { data: articles } = await useAsyncData('articles', () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all())

const title = 'Writing on Vue, Rails, and the tooling that keeps a small team shipping.'
const intro = 'All of my long-form thoughts on front-end architecture, testing, developer tooling and the occasional PHP throwback, collected in chronological order.'

useSeoMeta({
  title: 'Articles',
  description: intro,
})

defineOgImageComponent('Site', {
  title: 'Articles',
  description: intro,
})
</script>

<template>
  <SimpleLayout :title="title" :intro="intro">
    <div class="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
      <div class="flex max-w-3xl flex-col space-y-16">
        <ArticleCard v-for="article in articles ?? []" :key="article.path" :article="article" with-date-column />
        <p v-if="!articles?.length" class="text-sm text-zinc-500 dark:text-zinc-400">
          Nothing published yet.
        </p>
      </div>
    </div>
  </SimpleLayout>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: article } = await useAsyncData(`article-${route.params.slug}`, () =>
  queryCollection('articles').path(route.path).first())

if (!article.value || article.value.draft)
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })

useSeoMeta({
  title: article.value.title,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogType: 'article',
  articleAuthor: [article.value.author ?? 'Grant Stampfli'],
  articlePublishedTime: `${article.value.date}T00:00:00Z`,
})

defineOgImageComponent('Site', {
  title: article.value.title,
  description: article.value.description,
})
</script>

<template>
  <ArticleLayout v-if="article" :title="article.title" :date="article.date">
    <ContentRenderer :value="article" />
  </ArticleLayout>
</template>

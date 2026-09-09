<script setup lang="ts">
import type { ArticlesCollectionItem } from '@nuxt/content'

interface Props {
  article: ArticlesCollectionItem
  /** Articles index: date sits in the left column on md+ screens. */
  withDateColumn?: boolean
}

withDefaults(defineProps<Props>(), {
  withDateColumn: false,
})
</script>

<template>
  <article v-if="withDateColumn" class="md:grid md:grid-cols-4 md:items-baseline">
    <AppCard class="md:col-span-3">
      <CardTitle :href="article.path">
        {{ article.title }}
      </CardTitle>
      <CardEyebrow as="time" :datetime="article.date" class="md:hidden" decorate>
        {{ formatDate(article.date) }}
      </CardEyebrow>
      <CardDescription>{{ article.description }}</CardDescription>
      <CardCta>Read article</CardCta>
    </AppCard>
    <CardEyebrow as="time" :datetime="article.date" class="mt-1 max-md:hidden">
      {{ formatDate(article.date) }}
    </CardEyebrow>
  </article>

  <AppCard v-else as="article">
    <CardTitle :href="article.path">
      {{ article.title }}
    </CardTitle>
    <CardEyebrow as="time" :datetime="article.date" decorate>
      {{ formatDate(article.date) }}
    </CardEyebrow>
    <CardDescription>{{ article.description }}</CardDescription>
    <CardCta>Read article</CardCta>
  </AppCard>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('uses', () => queryCollection('uses').first())

const title = computed(() => page.value?.title ?? 'Software I use, gadgets I love, and other things I recommend.')
const intro = computed(() => page.value?.intro ?? '')

useSeoMeta({
  title: 'Uses',
  description: title,
})

defineOgImageComponent('Site', {
  title: 'Uses',
  description: title.value,
})
</script>

<template>
  <SimpleLayout :title="title" :intro="intro">
    <div class="space-y-20">
      <AppSection v-for="section in page?.sections ?? []" :key="section.title" :title="section.title">
        <ul role="list" class="space-y-16">
          <AppCard v-for="tool in section.tools" :key="tool.title" as="li">
            <CardTitle as="h3" :href="tool.href">
              {{ tool.title }}
            </CardTitle>
            <CardDescription>{{ tool.description }}</CardDescription>
          </AppCard>
        </ul>
      </AppSection>
    </div>
  </SimpleLayout>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('speaking', () => queryCollection('speaking').first())

const title = computed(() => page.value?.title ?? 'Speaking')
const intro = computed(() => page.value?.intro ?? '')
const sections = computed(() => (page.value?.sections ?? []).filter(section => section.appearances.length))

useSeoMeta({
  title: 'Speaking',
  description: intro,
})

defineOgImageComponent('Site', {
  title: 'Speaking',
  description: title.value,
})
</script>

<template>
  <SimpleLayout :title="title" :intro="intro">
    <div v-if="sections.length" class="space-y-20">
      <AppSection v-for="section in sections" :key="section.title" :title="section.title">
        <div class="space-y-16">
          <AppCard v-for="appearance in section.appearances" :key="appearance.title" as="article">
            <CardTitle as="h3" :href="appearance.href">
              {{ appearance.title }}
            </CardTitle>
            <CardEyebrow decorate>
              {{ appearance.event }}
            </CardEyebrow>
            <CardDescription>{{ appearance.description }}</CardDescription>
            <CardCta>{{ appearance.cta }}</CardCta>
          </AppCard>
        </div>
      </AppSection>
    </div>
    <p v-else class="text-sm text-zinc-500 dark:text-zinc-400">
      No talks or interviews listed yet. Add them to <code class="font-mono">content/speaking.yml</code>.
    </p>
  </SimpleLayout>
</template>

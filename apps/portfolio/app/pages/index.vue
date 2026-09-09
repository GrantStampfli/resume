<script setup lang="ts">
const appConfig = useAppConfig()

const [{ data: home }, { data: articles }, { data: experience }] = await Promise.all([
  useAsyncData('home', () => queryCollection('pages').path('/').first()),
  useAsyncData('home-articles', () =>
    queryCollection('articles')
      .where('draft', '=', false)
      .order('date', 'DESC')
      .limit(4)
      .all()),
  useAsyncData('experience', () => queryCollection('experience').first()),
])

const title = computed(() => home.value?.title ?? appConfig.site.tagline)
const description = computed(() => home.value?.description ?? appConfig.site.description)

useSeoMeta({
  title: appConfig.site.name,
  description,
  ogTitle: `${appConfig.site.name} - ${title.value}`,
  ogDescription: description,
})

defineOgImageComponent('Site', {
  title: appConfig.site.name,
  description: title.value,
})
</script>

<template>
  <div>
    <AppContainer class="mt-9">
      <div class="max-w-2xl">
        <h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          {{ title }}
        </h1>
        <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          {{ description }}
        </p>
        <div class="mt-6 flex gap-6">
          <NuxtLink
            v-for="social in appConfig.socials"
            :key="social.href"
            :to="social.href"
            :aria-label="social.label"
            target="_blank"
            external
            class="group -m-1 p-1"
          >
            <SocialIcon :name="social.icon" class="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
          </NuxtLink>
        </div>
      </div>
    </AppContainer>

    <PhotoStrip v-if="home?.photos?.length" :photos="home.photos" />

    <AppContainer class="mt-24 md:mt-28">
      <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
        <div class="flex flex-col gap-16">
          <ArticleCard v-for="article in articles ?? []" :key="article.path" :article="article" />
        </div>
        <div class="space-y-10 lg:pl-16 xl:pl-24">
          <NewsletterCard />
          <ResumeCard :experience="experience ?? null" />
        </div>
      </div>
    </AppContainer>
  </div>
</template>

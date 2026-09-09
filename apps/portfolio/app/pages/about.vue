<script setup lang="ts">
const appConfig = useAppConfig()

const { data: page } = await useAsyncData('about', () => queryCollection('pages').path('/about').first())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const email = computed(() => page.value?.email ?? appConfig.site.email)

useSeoMeta({
  title: 'About',
  description: page.value.description ?? page.value.title,
})

defineOgImageComponent('Site', {
  title: 'About',
  description: page.value.title,
})
</script>

<template>
  <AppContainer class="mt-16 sm:mt-32">
    <div class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
      <div class="lg:pl-20">
        <div class="max-w-xs px-2.5 lg:max-w-none">
          <NuxtImg
            :src="page?.portrait ?? '/images/portrait.jpg'"
            alt=""
            sizes="320px lg:512px"
            width="800"
            height="800"
            class="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
          />
        </div>
      </div>
      <div class="lg:order-first lg:row-span-2">
        <h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          {{ page?.title }}
        </h1>
        <ContentRenderer v-if="page" :value="page" class="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400 [&_a]:font-medium [&_a]:text-teal-500 [&_a]:transition [&_a]:hover:text-teal-600 [&_em]:italic [&_strong]:font-semibold [&_strong]:text-zinc-800 dark:[&_strong]:text-zinc-100" />
      </div>
      <div class="lg:pl-20">
        <ul role="list">
          <li v-for="(social, index) in appConfig.socials" :key="social.href" class="flex" :class="index > 0 && 'mt-4'">
            <NuxtLink :to="social.href" target="_blank" external class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500">
              <SocialIcon :name="social.icon" class="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
              <span class="ml-4">{{ social.label }}</span>
            </NuxtLink>
          </li>
          <li class="mt-8 flex border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
            <a :href="`mailto:${email}`" class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500">
              <IconsMailSolidIcon class="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
              <span class="ml-4">{{ email }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </AppContainer>
</template>

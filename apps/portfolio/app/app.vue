<script setup lang="ts">
const config = useRuntimeConfig()
const appConfig = useAppConfig()

useHead({
  titleTemplate: title => title && title !== appConfig.site.name ? `${title} - ${appConfig.site.name}` : `${appConfig.site.name} - ${appConfig.site.tagline}`,
  link: [
    { rel: 'canonical', href: config.public.siteUrl },
  ],
})

useSeoMeta({
  ogSiteName: appConfig.site.name,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <div class="flex w-full">
      <NuxtLoadingIndicator color="#14b8a6" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const config = useRuntimeConfig()
</script>

<template>
  <footer class="mt-32 flex-none">
    <ContainerOuter>
      <div class="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
        <ContainerInner>
          <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <NuxtLink v-for="item in appConfig.nav" :key="item.to" :to="item.to" class="transition hover:text-teal-500 dark:hover:text-teal-400">
                {{ item.label }}
              </NuxtLink>
              <NuxtLink :to="config.public.resumeUrl" target="_blank" external class="transition hover:text-teal-500 dark:hover:text-teal-400">
                Resume
              </NuxtLink>
            </div>
            <p class="text-sm text-zinc-400 dark:text-zinc-500">
              &copy; {{ new Date().getFullYear() }} {{ appConfig.site.name }}. All rights reserved.
            </p>
          </div>
        </ContainerInner>
      </div>
    </ContainerOuter>
  </footer>
</template>

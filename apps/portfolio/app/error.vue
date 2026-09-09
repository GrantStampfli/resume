<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: notFound.value ? 'Page not found' : 'Something went wrong' })
</script>

<template>
  <div class="flex w-full">
    <NuxtLayout>
      <AppContainer class="flex h-full items-center pt-16 sm:pt-32">
        <div class="flex flex-col items-center">
          <p class="text-base font-semibold text-zinc-400 dark:text-zinc-500">
            {{ error.statusCode }}
          </p>
          <h1 class="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {{ notFound ? 'Page not found' : 'Something went wrong' }}
          </h1>
          <p class="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            {{ notFound ? 'Sorry, we couldn’t find the page you’re looking for.' : error.statusMessage }}
          </p>
          <AppButton href="/" variant="secondary" class="mt-4" @click="clearError({ redirect: '/' })">
            Go back home
          </AppButton>
        </div>
      </AppContainer>
    </NuxtLayout>
  </div>
</template>

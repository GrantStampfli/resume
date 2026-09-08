<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

defineProps<Props>()

useSeoMeta({ title: 'Page not found' })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UError :error="error" />
    </NuxtLayout>
  </UApp>
</template>

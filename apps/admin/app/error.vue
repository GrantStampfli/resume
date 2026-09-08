<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

defineProps<Props>()
</script>

<template>
  <UApp>
    <UContainer class="min-h-screen flex items-center justify-center">
      <UError :error="error" />
    </UContainer>
  </UApp>
</template>

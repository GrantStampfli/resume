<script setup lang="ts">
interface Props {
  title: string
  intro?: string
}

defineProps<Props>()

const slots = useSlots()
</script>

<template>
  <AppContainer class="mt-16 sm:mt-32">
    <header class="max-w-2xl">
      <h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
        {{ title }}
      </h1>
      <p v-if="intro" class="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        {{ intro }}
      </p>
    </header>
    <div v-if="slots.default" class="mt-16 sm:mt-20">
      <slot />
    </div>
  </AppContainer>
</template>

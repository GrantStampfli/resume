<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

withDefaults(defineProps<Props>(), {
  align: 'center',
})
</script>

<template>
  <div class="mb-10" :class="align === 'center' ? 'text-center' : 'text-left'">
    <h2 class="font-display text-4xl sm:text-5xl tracking-wide uppercase text-highlighted">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-3 text-lg text-muted">
      {{ subtitle }}
    </p>
    <div class="mt-5 h-1 w-16 rounded bg-primary" :class="align === 'center' ? 'mx-auto' : ''" />
  </div>
</template>

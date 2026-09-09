<script setup lang="ts">
interface Props {
  as?: string
  decorate?: boolean
  datetime?: string
}

withDefaults(defineProps<Props>(), {
  as: 'p',
  decorate: false,
})
</script>

<template>
  <component
    :is="as"
    class="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500"
    :class="decorate && 'pl-3.5'"
    :datetime="datetime"
  >
    <span v-if="decorate" class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
      <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
    </span>
    <slot />
  </component>
</template>

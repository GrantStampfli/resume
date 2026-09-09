<script setup lang="ts">
interface Props {
  as?: string
  href?: string
}

withDefaults(defineProps<Props>(), {
  as: 'h2',
})
</script>

<template>
  <component :is="as" class="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
    <CardLink v-if="href" :href="href">
      <slot />
    </CardLink>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
interface Props {
  as?: string
}

withDefaults(defineProps<Props>(), {
  as: 'div',
})
</script>

<template>
  <component :is="as" class="group relative flex flex-col items-start">
    <slot />
  </component>
</template>

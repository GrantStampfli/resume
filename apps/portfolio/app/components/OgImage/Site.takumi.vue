<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  siteName?: string
  siteUrl?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Grant Stampfli',
  description: 'Senior full stack engineer',
  siteName: 'Grant Stampfli',
  siteUrl: 'grantstampfli.com',
})
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between p-[72px] bg-zinc-900 text-zinc-100">
    <div class="flex items-center gap-4">
      <div class="w-4 h-4 rounded-full bg-teal-500" />
      <span class="text-[28px] font-semibold tracking-tight text-zinc-300">{{ siteName }}</span>
    </div>

    <div class="flex flex-col gap-6">
      <h1 class="text-[72px] font-bold leading-[1.05] tracking-tight max-w-[1000px] m-0">
        {{ title }}
      </h1>
      <p v-if="description" class="text-[32px] leading-snug text-zinc-400 max-w-[900px] m-0">
        {{ description }}
      </p>
    </div>

    <div class="flex items-center justify-between text-[24px] text-zinc-500">
      <span>{{ siteUrl }}</span>
      <span>Portfolio</span>
    </div>
  </div>
</template>

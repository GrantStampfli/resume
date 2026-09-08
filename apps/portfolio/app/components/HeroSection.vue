<script setup lang="ts">
import type { PagesCollectionItem } from '@nuxt/content'

interface Props {
  page: PagesCollectionItem | null
}

const props = defineProps<Props>()
const appConfig = useAppConfig()

const slides = computed(() => props.page?.slides ?? [])
const links = computed(() => props.page?.links ?? [])
</script>

<template>
  <section id="top" class="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-black text-white">
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div
        v-for="slide in slides"
        :key="slide"
        class="hero-slide absolute inset-0 bg-cover bg-center grayscale"
        :style="{ backgroundImage: `url(${slide})` }"
      />
      <div class="absolute inset-0 bg-black/55" />
    </div>

    <UContainer class="py-24 text-center">
      <NuxtImg
        v-if="page?.avatar"
        :src="page.avatar"
        :alt="page.title"
        width="160"
        height="160"
        class="mx-auto mb-8 size-32 sm:size-40 rounded-full object-cover ring-4 ring-white/70 shadow-2xl"
        sizes="160px"
        preload
      />

      <h1 class="font-display text-6xl sm:text-8xl tracking-wide">
        {{ page?.title ?? appConfig.site.name }}
      </h1>
      <p class="mt-4 text-xl sm:text-2xl font-light text-white/85">
        {{ page?.headline ?? appConfig.site.tagline }}
      </p>
      <p v-if="page?.description" class="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/70">
        {{ page.description }}
      </p>

      <div v-if="links.length" class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <UButton
          v-for="link in links"
          :key="link.to"
          v-bind="link"
          size="xl"
          :color="(link.color as any) ?? 'primary'"
          :variant="(link.variant as any) ?? 'solid'"
        />
      </div>

      <div class="mt-12 flex items-center justify-center gap-2">
        <UButton
          v-for="social in appConfig.socials"
          :key="social.to"
          :icon="social.icon"
          :to="social.to"
          :aria-label="social.label"
          color="neutral"
          variant="ghost"
          size="xl"
          target="_blank"
          class="text-white/80 hover:text-white"
        />
      </div>
    </UContainer>

    <a
      href="#about"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 hover:text-white animate-bounce"
      aria-label="Scroll to about"
    >
      <UIcon name="i-lucide-chevron-down" class="size-8" />
    </a>
  </section>
</template>

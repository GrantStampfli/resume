<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const config = useRuntimeConfig()
const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  ...appConfig.nav.map(item => ({
    ...item,
    // Section anchors only exist on the home page.
    to: item.to.startsWith('#') && route.path !== '/' ? `/${item.to}` : item.to,
  })),
  { label: 'Resume', to: config.public.resumeUrl, target: '_blank', icon: 'i-lucide-file-text' },
])
</script>

<template>
  <UHeader :title="appConfig.site.name" to="/" mode="drawer" :ui="{ root: 'bg-default/80 backdrop-blur border-b border-default' }">
    <template #title>
      <span class="font-display text-2xl tracking-wide">{{ appConfig.site.name }}</span>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
      <UButton
        v-for="social in appConfig.socials"
        :key="social.to"
        :icon="social.icon"
        :to="social.to"
        :aria-label="social.label"
        color="neutral"
        variant="ghost"
        target="_blank"
        class="hidden sm:inline-flex"
      />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} {{ appConfig.site.name }} · {{ appConfig.site.location }}
      </p>
    </template>

    <template #right>
      <UButton
        v-for="social in appConfig.socials"
        :key="social.to"
        :icon="social.icon"
        :to="social.to"
        :aria-label="social.label"
        color="neutral"
        variant="ghost"
        target="_blank"
      />
    </template>
  </UFooter>
</template>

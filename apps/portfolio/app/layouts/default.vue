<script setup lang="ts">
const appConfig = useAppConfig()
const config = useRuntimeConfig()

const items = computed(() => [
  ...appConfig.nav,
  { label: 'Resume', to: config.public.resumeUrl, target: '_blank' },
])
</script>

<template>
  <UHeader :title="appConfig.site.name" to="/">
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
        © {{ new Date().getFullYear() }} {{ appConfig.site.name }}
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

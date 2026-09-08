<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { clear, user } = useUserSession()
const config = useRuntimeConfig()

const items: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
    { label: 'Resume', icon: 'i-lucide-file-text', to: '/resume' },
    { label: 'Portfolio content', icon: 'i-lucide-folder-open', to: '/content' },
    { label: 'Uploads', icon: 'i-lucide-image', to: '/uploads' },
  ],
  [
    { label: 'Portfolio site', icon: 'i-lucide-external-link', to: config.public.portfolioUrl, target: '_blank' },
    { label: 'Resume site', icon: 'i-lucide-external-link', to: config.public.resumeUrl, target: '_blank' },
  ],
]

async function logout(): Promise<void> {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 font-semibold">
          <UIcon name="i-lucide-shield-check" class="size-5 text-primary" />
          <span v-if="!collapsed">Stampfli admin</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :items="items[0]" :collapsed="collapsed" orientation="vertical" />
        <UNavigationMenu :items="items[1]" :collapsed="collapsed" orientation="vertical" class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <div class="flex items-center justify-between gap-2 w-full">
          <span v-if="!collapsed" class="text-sm text-muted truncate">{{ user?.name ?? 'Admin' }}</span>
          <UColorModeButton />
          <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" aria-label="Log out" @click="logout" />
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>

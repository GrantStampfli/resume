<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()

const open = shallowRef(false)

// Close the panel once a link has navigated.
watch(() => route.path, () => {
  open.value = false
})
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-zinc-800/40 backdrop-blur-xs dark:bg-black/80',
      // The default theme centres the panel with `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`;
      // the translations survive tailwind-merge, so reset them explicitly.
      content: 'fixed inset-x-4 top-8 translate-x-0 translate-y-0 w-auto max-w-none sm:max-w-none divide-y-0 origin-top rounded-3xl bg-white p-8 shadow-none ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800',
    }"
    aria-label="Navigation"
  >
    <button
      type="button"
      class="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20"
    >
      Menu
      <IconsChevronDownIcon class="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
    </button>

    <template #content>
      <div class="flex flex-row-reverse items-center justify-between">
        <button type="button" aria-label="Close menu" class="-m-1 p-1" @click="open = false">
          <IconsCloseIcon class="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
        </button>
        <h2 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Navigation
        </h2>
      </div>
      <nav class="mt-6">
        <ul class="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
          <li v-for="item in appConfig.nav" :key="item.to">
            <NuxtLink :to="item.to" class="block py-2" @click="open = false">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </template>
  </UModal>
</template>

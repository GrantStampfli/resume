<script setup lang="ts">
const colorMode = useColorMode()
const mounted = shallowRef(false)

onMounted(() => {
  mounted.value = true
})

const otherTheme = computed(() => colorMode.value === 'dark' ? 'light' : 'dark')

function toggle(): void {
  // Like Spotlight's ThemeWatcher: fall back to "system" when the choice matches the OS.
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  colorMode.preference = otherTheme.value === system ? 'system' : otherTheme.value
}
</script>

<template>
  <button
    type="button"
    :aria-label="mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'"
    class="group rounded-full bg-white/90 px-3 py-2 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
    @click="toggle"
  >
    <IconsSunIcon class="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-teal-50 [@media(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600" />
    <IconsMoonIcon class="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition not-[@media_(prefers-color-scheme:dark)]:fill-teal-400/10 not-[@media_(prefers-color-scheme:dark)]:stroke-teal-500 dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400" />
  </button>
</template>

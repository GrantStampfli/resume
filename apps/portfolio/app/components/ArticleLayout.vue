<script setup lang="ts">
interface Props {
  title: string
  date: string
  backTo?: string
  backLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  backTo: '/articles',
  backLabel: 'Go back to articles',
})

const router = useRouter()

// Like Spotlight: go back in history when we came from within the site, otherwise to the index.
function goBack(): void {
  if (window.history.state?.back)
    router.back()
  else
    router.push(props.backTo)
}
</script>

<template>
  <AppContainer class="mt-16 lg:mt-32">
    <div class="xl:relative">
      <div class="mx-auto max-w-2xl">
        <button
          type="button"
          :aria-label="backLabel"
          class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
          @click="goBack"
        >
          <IconsArrowLeftIcon class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
        </button>
        <article>
          <header class="flex flex-col">
            <h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              {{ title }}
            </h1>
            <time :datetime="date" class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500">
              <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
              <span class="ml-3">{{ formatDate(date) }}</span>
            </time>
            <slot name="meta" />
          </header>
          <AppProse class="mt-8" data-article-content>
            <slot />
          </AppProse>
        </article>
      </div>
    </div>
  </AppContainer>
</template>

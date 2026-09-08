<script setup lang="ts">
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const route = useRoute()
const appConfig = useAppConfig()

const isHomePage = computed(() => route.path === '/')

const headerRef = useTemplateRef<HTMLElement>('header')
const avatarRef = useTemplateRef<HTMLElement>('avatar')

useHeaderScroll(headerRef, avatarRef, isHomePage)

// The scroll composable drives these through CSS custom properties on <html>.
// `position: var(...)` is not a value Vue's CSSProperties type accepts, so these are style strings.
const headerStyle = 'height: var(--header-height); margin-bottom: var(--header-mb)'
const stickyStyle = 'position: var(--header-position)'
const innerStyle = 'position: var(--header-inner-position)'
const avatarBorderStyle = 'opacity: var(--avatar-border-opacity, 0); transform: var(--avatar-border-transform)'
const avatarImageStyle = 'transform: var(--avatar-image-transform)'

function isActive(to: string): boolean {
  return route.path === to
}
</script>

<template>
  <header
    class="pointer-events-none relative z-50 flex flex-none flex-col"
    :style="headerStyle"
  >
    <template v-if="isHomePage">
      <div ref="avatar" class="order-last mt-[calc(--spacing(16)-(--spacing(3)))]" />
      <div class="top-0 order-last -mb-3 pt-3 sm:px-8" :style="stickyStyle">
        <div class="mx-auto w-full max-w-7xl lg:px-8">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
              <div class="top-(--avatar-top,--spacing(3)) w-full" :style="innerStyle">
                <div class="relative">
                  <div
                    class="absolute top-3 left-0 h-10 w-10 origin-left rounded-full bg-white/90 p-0.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm transition-opacity dark:bg-zinc-800/90 dark:ring-white/10"
                    :style="avatarBorderStyle"
                  />
                  <NuxtLink to="/" aria-label="Home" class="pointer-events-auto block h-16 w-16 origin-left" :style="avatarImageStyle">
                    <NuxtImg
                      src="/images/avatar.jpg"
                      alt=""
                      sizes="64px"
                      width="64"
                      height="64"
                      class="h-16 w-16 rounded-full bg-zinc-100 object-cover dark:bg-zinc-800"
                      preload
                    />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div ref="header" class="top-0 z-10 h-16 pt-6" :style="stickyStyle">
      <div class="top-(--header-top,--spacing(6)) w-full sm:px-8" :style="innerStyle">
        <div class="mx-auto w-full max-w-7xl lg:px-8">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
              <div class="relative flex gap-4">
                <div class="flex flex-1">
                  <div v-if="!isHomePage" class="h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10">
                    <NuxtLink to="/" aria-label="Home" class="pointer-events-auto">
                      <NuxtImg
                        src="/images/avatar.jpg"
                        alt=""
                        sizes="36px"
                        width="36"
                        height="36"
                        class="h-9 w-9 rounded-full bg-zinc-100 object-cover dark:bg-zinc-800"
                        preload
                      />
                    </NuxtLink>
                  </div>
                </div>

                <div class="flex flex-1 justify-end md:justify-center">
                  <!-- Mobile navigation -->
                  <Popover v-slot="{ open, close }" class="pointer-events-auto md:hidden">
                    <PopoverButton class="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
                      Menu
                      <IconsChevronDownIcon class="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
                    </PopoverButton>
                    <TransitionRoot :show="open">
                      <TransitionChild
                        as="template"
                        enter="duration-150 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-150 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                      >
                        <PopoverOverlay class="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-xs dark:bg-black/80" />
                      </TransitionChild>
                      <TransitionChild
                        as="template"
                        enter="duration-150 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-150 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                      >
                        <PopoverPanel focus class="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800">
                          <div class="flex flex-row-reverse items-center justify-between">
                            <PopoverButton aria-label="Close menu" class="-m-1 p-1">
                              <IconsCloseIcon class="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                            </PopoverButton>
                            <h2 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                              Navigation
                            </h2>
                          </div>
                          <nav class="mt-6">
                            <ul class="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                              <li v-for="item in appConfig.nav" :key="item.to">
                                <NuxtLink :to="item.to" class="block py-2" @click="close()">
                                  {{ item.label }}
                                </NuxtLink>
                              </li>
                            </ul>
                          </nav>
                        </PopoverPanel>
                      </TransitionChild>
                    </TransitionRoot>
                  </Popover>

                  <!-- Desktop navigation -->
                  <nav class="pointer-events-auto hidden md:block">
                    <ul class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                      <li v-for="item in appConfig.nav" :key="item.to">
                        <NuxtLink
                          :to="item.to"
                          class="relative block px-3 py-2 transition"
                          :class="isActive(item.to) ? 'text-teal-500 dark:text-teal-400' : 'hover:text-teal-500 dark:hover:text-teal-400'"
                        >
                          {{ item.label }}
                          <span v-if="isActive(item.to)" class="absolute inset-x-1 -bottom-px h-px bg-linear-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
                        </NuxtLink>
                      </li>
                    </ul>
                  </nav>
                </div>

                <div class="flex justify-end md:flex-1">
                  <div class="pointer-events-auto">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div v-if="isHomePage" class="flex-none" :style="{ height: 'var(--content-offset)' }" />
</template>

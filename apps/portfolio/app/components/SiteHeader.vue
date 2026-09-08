<script setup lang="ts">
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
                  <MobileNavigation class="pointer-events-auto md:hidden" />

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

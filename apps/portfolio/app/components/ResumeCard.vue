<script setup lang="ts">
import type { ExperienceCollectionItem } from '@nuxt/content'

interface Props {
  experience: ExperienceCollectionItem | null
}

const props = defineProps<Props>()
const config = useRuntimeConfig()

const roles = computed(() => (props.experience?.items ?? [])
  .filter(item => item.kind !== 'education')
  .slice(0, 4)
  .map(item => ({
    company: item.organisation,
    title: item.role,
    logo: item.logo,
    start: { label: formatPeriod(item.start), dateTime: item.start },
    end: item.end && item.end !== 'Present'
      ? { label: formatPeriod(item.end), dateTime: item.end }
      : { label: 'Present', dateTime: new Date().getFullYear().toString() },
  })))
</script>

<template>
  <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
    <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      <IconsBriefcaseIcon class="h-6 w-6 flex-none" />
      <span class="ml-3">Work</span>
    </h2>
    <ol class="mt-6 space-y-4">
      <li v-for="role in roles" :key="`${role.company}-${role.start.dateTime}`" class="flex gap-4">
        <div class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
          <img v-if="role.logo" :src="role.logo" alt="" class="h-7 w-7">
          <span v-else class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{{ initials(role.company) }}</span>
        </div>
        <dl class="flex flex-auto flex-wrap gap-x-2">
          <dt class="sr-only">
            Company
          </dt>
          <dd class="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {{ role.company }}
          </dd>
          <dt class="sr-only">
            Role
          </dt>
          <dd class="text-xs text-zinc-500 dark:text-zinc-400">
            {{ role.title }}
          </dd>
          <dt class="sr-only">
            Date
          </dt>
          <dd class="ml-auto text-xs text-zinc-400 dark:text-zinc-500" :aria-label="`${role.start.label} until ${role.end.label}`">
            <time :datetime="role.start.dateTime">{{ role.start.label }}</time>
            <span aria-hidden="true"> — </span>
            <time :datetime="role.end.dateTime">{{ role.end.label }}</time>
          </dd>
        </dl>
      </li>
    </ol>
    <AppButton :href="`${config.public.resumeUrl}/resume.pdf`" external variant="secondary" class="group mt-6 w-full">
      Download CV
      <IconsArrowDownIcon class="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import type { ExperienceCollectionItem } from '@nuxt/content'

interface Props {
  experience: ExperienceCollectionItem | null
}

const props = defineProps<Props>()

const work = computed(() => (props.experience?.items ?? []).filter(item => item.kind !== 'education'))
const education = computed(() => (props.experience?.items ?? []).filter(item => item.kind === 'education'))

function period(item: { start: string, end?: string }): string {
  return item.end ? `${format(item.start)} – ${format(item.end)}` : format(item.start)
}

function format(value: string): string {
  if (!/^\d{4}(?:-\d{2})?$/.test(value))
    return value
  const [year, month] = value.split('-')
  if (!month)
    return year!
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <section id="experience" class="scroll-mt-16 py-20 sm:py-28 bg-elevated/50">
    <UContainer>
      <SectionHeading :title="experience?.title ?? 'Experience'" :subtitle="experience?.subtitle" />

      <div class="grid gap-12 lg:grid-cols-3">
        <ol class="lg:col-span-2 relative border-s border-default ps-6 space-y-10">
          <li v-for="item in work" :key="`${item.organisation}-${item.start}`" class="relative">
            <span class="absolute -start-[31px] top-1.5 size-3 rounded-full bg-primary ring-4 ring-default" />
            <p class="text-xs uppercase tracking-wider text-muted">
              {{ period(item) }}<span v-if="item.location"> · {{ item.location }}</span>
            </p>
            <h3 class="mt-1 text-xl font-semibold text-highlighted">
              {{ item.role }}
              <span class="text-muted font-normal">at</span>
              <ULink v-if="item.url" :to="item.url" target="_blank" class="text-primary">
                {{ item.organisation }}
              </ULink>
              <span v-else>{{ item.organisation }}</span>
            </h3>
            <p class="mt-2 text-toned">
              {{ item.summary }}
            </p>
            <ul v-if="item.highlights?.length" class="mt-3 list-disc ps-5 space-y-1 text-sm text-muted">
              <li v-for="highlight in item.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </li>
        </ol>

        <div v-if="education.length" class="space-y-6">
          <h3 class="font-display text-2xl uppercase tracking-wide text-highlighted">
            Education
          </h3>
          <UCard v-for="item in education" :key="item.organisation" variant="subtle">
            <p class="text-xs uppercase tracking-wider text-muted">
              {{ period(item) }}
            </p>
            <p class="mt-1 font-semibold text-highlighted">
              {{ item.role }}
            </p>
            <ULink v-if="item.url" :to="item.url" target="_blank" class="text-sm text-primary">
              {{ item.organisation }}
            </ULink>
            <p v-else class="text-sm text-muted">
              {{ item.organisation }}
            </p>
            <p class="mt-3 text-sm text-toned">
              {{ item.summary }}
            </p>
            <ul v-if="item.highlights?.length" class="mt-3 list-disc ps-5 space-y-1 text-sm text-muted">
              <li v-for="highlight in item.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </UCard>
        </div>
      </div>
    </UContainer>
  </section>
</template>

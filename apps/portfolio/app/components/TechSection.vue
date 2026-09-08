<script setup lang="ts">
import type { TechCollectionItem } from '@nuxt/content'

interface Props {
  tech: TechCollectionItem | null
}

defineProps<Props>()
</script>

<template>
  <section id="tech" class="scroll-mt-16 py-20 sm:py-28 bg-elevated/50">
    <UContainer>
      <SectionHeading :title="tech?.title ?? 'Technologies'" :subtitle="tech?.subtitle" />

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <UCard
          v-for="item in tech?.items ?? []"
          :key="item.name"
          variant="subtle"
          :ui="{ body: 'flex items-center gap-4 p-4 sm:p-5' }"
        >
          <span class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon :name="item.icon" class="size-7" />
          </span>
          <div class="min-w-0">
            <p class="font-semibold text-highlighted truncate">
              {{ item.name }}
            </p>
            <p v-if="item.note" class="text-xs text-muted truncate">
              {{ item.note }}
            </p>
          </div>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

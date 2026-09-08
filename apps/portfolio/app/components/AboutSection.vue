<script setup lang="ts">
import type { PagesCollectionItem } from '@nuxt/content'

interface Props {
  page: PagesCollectionItem | null
}

defineProps<Props>()
</script>

<template>
  <section id="about" class="scroll-mt-16 py-20 sm:py-28">
    <UContainer>
      <SectionHeading :title="page?.title ?? 'About'" :subtitle="page?.headline" />

      <div class="grid gap-10 lg:grid-cols-5">
        <div class="lg:col-span-3">
          <p v-if="page?.description" class="text-xl text-highlighted mb-6">
            {{ page.description }}
          </p>
          <ContentRenderer v-if="page" :value="page" class="prose dark:prose-invert max-w-none" />
        </div>

        <aside class="lg:col-span-2">
          <UCard variant="subtle" class="h-full">
            <blockquote v-if="page?.quote" class="font-light italic text-lg leading-relaxed text-toned">
              <UIcon name="i-lucide-quote" class="size-6 text-primary mb-3" />
              {{ page.quote }}
            </blockquote>
          </UCard>
        </aside>
      </div>
    </UContainer>
  </section>
</template>

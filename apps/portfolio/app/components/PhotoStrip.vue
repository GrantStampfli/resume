<script setup lang="ts">
interface Props {
  photos: string[]
}

defineProps<Props>()

const rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']
</script>

<template>
  <div class="mt-16 sm:mt-20">
    <div class="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
      <div
        v-for="(photo, index) in photos"
        :key="photo"
        class="relative w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800"
        :class="rotations[index % rotations.length]"
      >
        <div class="aspect-9/10">
          <NuxtImg
            :src="photo"
            alt=""
            sizes="176px sm:288px"
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

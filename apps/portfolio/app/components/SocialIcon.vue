<script setup lang="ts">
import GitHubIcon from './icons/GitHubIcon.vue'
import InstagramIcon from './icons/InstagramIcon.vue'
import LinkedInIcon from './icons/LinkedInIcon.vue'
import XIcon from './icons/XIcon.vue'

interface Props {
  name: 'x' | 'github' | 'linkedin' | 'instagram'
}

const props = defineProps<Props>()

const icons = {
  x: XIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
}

const icon = computed(() => icons[props.name])
</script>

<template>
  <component :is="icon" />
</template>

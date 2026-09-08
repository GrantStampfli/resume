<script setup lang="ts">
const appConfig = useAppConfig()

const [{ data: home }, { data: about }, { data: tech }, { data: experience }, { data: projects }] = await Promise.all([
  useAsyncData('home', () => queryCollection('pages').path('/').first()),
  useAsyncData('about', () => queryCollection('pages').path('/about').first()),
  useAsyncData('tech', () => queryCollection('tech').first()),
  useAsyncData('experience', () => queryCollection('experience').first()),
  useAsyncData('featured-projects', () =>
    queryCollection('projects')
      .where('featured', '=', true)
      .where('draft', '=', false)
      .order('date', 'DESC')
      .limit(3)
      .all()),
])

const description = computed(() => home.value?.description ?? appConfig.site.tagline)

useSeoMeta({
  title: home.value?.title ?? appConfig.site.name,
  description,
  ogTitle: appConfig.site.name,
  ogDescription: description,
})

defineOgImageComponent('Site', {
  title: appConfig.site.name,
  description: description.value,
})
</script>

<template>
  <div>
    <HeroSection :page="home ?? null" />
    <AboutSection :page="about ?? null" />
    <TechSection :tech="tech ?? null" />
    <WorkSection :projects="projects ?? []" />
    <ExperienceSection :experience="experience ?? null" />
    <ContactSection />
  </div>
</template>

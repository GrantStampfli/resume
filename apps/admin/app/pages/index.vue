<script setup lang="ts">
import type { ContentEntry } from '#shared/types/content'

useSeoMeta({ title: 'Dashboard' })

const { data: status } = await useAdminStatus()
const { data: content } = await useFetch<ContentEntry[]>('/api/content', { default: () => [] })

const projects = computed(() => content.value.filter(entry => entry.path.startsWith('projects/')).length)
const pages = computed(() => content.value.length - projects.value)
</script>

<template>
  <UDashboardPanel id="dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #right>
          <StorageBadge :status="status" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageGrid class="lg:grid-cols-3">
        <UPageCard
          title="Resume"
          description="Edit apps/resume-gen/resume.md, the source for gstampfli.com."
          icon="i-lucide-file-text"
          to="/resume"
          variant="subtle"
        />
        <UPageCard
          title="Portfolio content"
          :description="`${pages} pages and ${projects} projects under apps/portfolio/content.`"
          icon="i-lucide-folder-open"
          to="/content"
          variant="subtle"
        />
        <UPageCard
          title="Uploads"
          :description="status.blobConfigured ? 'Images stored in Vercel Blob.' : 'Set BLOB_READ_WRITE_TOKEN to enable uploads.'"
          icon="i-lucide-image"
          to="/uploads"
          variant="subtle"
        />
      </UPageGrid>

      <UCard class="mt-8">
        <template #header>
          <h2 class="font-semibold">
            How publishing works
          </h2>
        </template>

        <ul class="space-y-2 text-sm text-muted list-disc pl-5">
          <li v-if="status.storage === 'github'">
            Saves are committed to <code>{{ status.repo }}</code> on <code>{{ status.branch }}</code>.
            The GitHub Actions workflow rebuilds the resume site and Vercel redeploys the portfolio.
          </li>
          <li v-else>
            Saves write to the local checkout. Commit and push when you are happy with the result.
          </li>
          <li v-if="status.deployHookConfigured">
            A Vercel deploy hook is pinged after every save.
          </li>
          <li v-if="status.canBuildResume">
            The resume page can run the PHP generator locally to check the HTML and PDF.
          </li>
        </ul>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { ContentEntry } from '#shared/types/content'

useSeoMeta({ title: 'Dashboard' })

const toast = useToast()
const { data: status, refresh: refreshStatus } = await useAdminStatus()
const { data: content, refresh: refreshContent } = await useFetch<ContentEntry[]>('/api/content', { default: () => [] })

const projects = computed(() => content.value.filter(entry => entry.path.startsWith('projects/')).length)
const pages = computed(() => content.value.length - projects.value)

const importing = shallowRef(false)

async function importFiles(overwrite: boolean): Promise<void> {
  if (overwrite) {
    // eslint-disable-next-line no-alert -- a native confirm is fine for a single-user admin
    if (!window.confirm('Replace every row with the file in the checkout? Edits made here will be lost.'))
      return
  }

  importing.value = true
  try {
    const result = await $fetch<{ imported: number, skipped: number }>('/api/database/import', {
      method: 'POST',
      body: { overwrite },
    })
    await Promise.all([refreshStatus(), refreshContent()])
    toast.add({
      title: `Imported ${result.imported} files`,
      description: result.skipped ? `${result.skipped} already in the database` : undefined,
      icon: 'i-lucide-database',
      color: 'success',
    })
  }
  catch (error) {
    const message = (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? String(error)
    toast.add({ title: 'Import failed', description: message, color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    importing.value = false
  }
}
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
          description="Edit apps/resume-gen/resume.yml, the source for gstampfli.com."
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

      <UCard v-if="status.storage === 'db'" class="mt-8">
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h2 class="font-semibold">
              Content database
            </h2>
            <UBadge :label="`${status.entries ?? 0} rows`" color="neutral" variant="subtle" />
          </div>
        </template>

        <p class="text-sm text-muted">
          Content lives in a {{ status.dialect }} database. Every save keeps the previous body as a
          revision, so any entry can be rolled back from its History panel. The portfolio reads these
          rows when it builds.
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <UButton
            label="Import files"
            icon="i-lucide-download"
            variant="subtle"
            :loading="importing"
            @click="importFiles(false)"
          />
          <UButton
            label="Reimport and overwrite"
            icon="i-lucide-refresh-cw"
            color="warning"
            variant="ghost"
            :loading="importing"
            @click="importFiles(true)"
          />
        </div>
      </UCard>

      <UCard class="mt-8">
        <template #header>
          <h2 class="font-semibold">
            How publishing works
          </h2>
        </template>

        <ul class="space-y-2 text-sm text-muted list-disc pl-5">
          <li v-if="status.storage === 'db'">
            Saves are rows in the content database. The portfolio reads them at build time, so a
            deploy publishes the change.
          </li>
          <li v-else-if="status.storage === 'github'">
            Saves are committed to <code>{{ status.repo }}</code> on <code>{{ status.branch }}</code>.
            The GitHub Actions workflow rebuilds the resume site and Vercel redeploys the portfolio.
          </li>
          <li v-else>
            Saves write to the local checkout. Commit and push when you are happy with the result.
          </li>
          <li v-if="status.deployHookConfigured">
            A Vercel deploy hook is pinged after every save.
          </li>
          <li v-else-if="status.storage === 'db'">
            Set <code>NUXT_VERCEL_DEPLOY_HOOK_URL</code> so a save triggers a deploy automatically.
          </li>
          <li v-if="status.canBuildResume">
            The resume page can run the PHP generator locally to check the HTML and PDF.
          </li>
        </ul>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

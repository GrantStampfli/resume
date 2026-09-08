<script setup lang="ts">
import type { UploadedAsset } from '#shared/types/content'

useSeoMeta({ title: 'Uploads' })

const toast = useToast()
const { data: status } = await useAdminStatus()
const { data: assets, refresh } = await useFetch<UploadedAsset[]>('/api/uploads', { default: () => [] })

const uploading = shallowRef(false)
const input = useTemplateRef<HTMLInputElement>('input')

async function upload(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  const body = new FormData()
  body.append('file', file)

  uploading.value = true
  try {
    const asset = await $fetch<UploadedAsset>('/api/uploads', { method: 'POST', body })
    await refresh()
    toast.add({ title: 'Uploaded', description: asset.url, icon: 'i-lucide-check', color: 'success' })
  }
  catch (error) {
    const message = (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? String(error)
    toast.add({ title: 'Upload failed', description: message, color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    uploading.value = false
    if (input.value)
      input.value.value = ''
  }
}

async function copy(url: string): Promise<void> {
  await navigator.clipboard.writeText(url)
  toast.add({ title: 'URL copied', icon: 'i-lucide-clipboard-check' })
}

function formatSize(bytes: number): string {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}
</script>

<template>
  <UDashboardPanel id="uploads">
    <template #header>
      <UDashboardNavbar title="Uploads">
        <template #right>
          <input ref="input" type="file" accept="image/*,application/pdf" class="hidden" @change="upload">
          <UButton
            label="Upload"
            icon="i-lucide-upload"
            :loading="uploading"
            :disabled="!status.blobConfigured"
            @click="input?.click()"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UAlert
        v-if="!status.blobConfigured"
        icon="i-lucide-info"
        color="neutral"
        variant="subtle"
        title="Vercel Blob is not configured"
        description="Set BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob) to upload images for the portfolio."
      />

      <UPageGrid v-else-if="assets.length" class="lg:grid-cols-4">
        <UCard v-for="asset in assets" :key="asset.url" :ui="{ body: 'p-0 sm:p-0' }">
          <img
            v-if="!asset.pathname.endsWith('.pdf')"
            :src="asset.url"
            :alt="asset.pathname"
            class="aspect-video w-full object-cover rounded-t-lg"
            loading="lazy"
          >
          <div v-else class="aspect-video flex items-center justify-center text-muted">
            <UIcon name="i-lucide-file" class="size-8" />
          </div>
          <div class="p-3 flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="text-sm truncate" :title="asset.pathname">
                {{ asset.pathname.replace('portfolio/', '') }}
              </p>
              <p class="text-xs text-muted">
                {{ formatSize(asset.size) }}
              </p>
            </div>
            <UButton icon="i-lucide-copy" size="xs" color="neutral" variant="ghost" aria-label="Copy URL" @click="copy(asset.url)" />
          </div>
        </UCard>
      </UPageGrid>

      <UAlert
        v-else
        icon="i-lucide-image"
        color="neutral"
        variant="subtle"
        title="No uploads yet"
        description="Upload an image and paste its URL into a project's image field."
      />
    </template>
  </UDashboardPanel>
</template>

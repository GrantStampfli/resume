<script setup lang="ts">
const toast = useToast()

const email = shallowRef('')
const website = shallowRef('')
const pending = shallowRef(false)
const subscribed = shallowRef(false)

async function subscribe(): Promise<void> {
  pending.value = true
  try {
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: { email: email.value, website: website.value },
    })
    subscribed.value = true
    toast.add({
      title: 'You’re on the list',
      description: 'I’ll email you when I publish something new.',
      color: 'success',
      icon: 'i-lucide-mail-check',
    })
  }
  catch (error) {
    const message = (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Please try again'
    toast.add({ title: 'Could not subscribe', description: message, color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40" @submit.prevent="subscribe">
    <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      <IconsMailIcon class="h-6 w-6 flex-none" />
      <span class="ml-3">Stay up to date</span>
    </h2>
    <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
      Get notified when I publish something new, and unsubscribe at any time.
    </p>

    <p v-if="subscribed" class="mt-6 flex items-center text-sm font-medium text-teal-500">
      <UIcon name="i-lucide-check" class="mr-2 h-5 w-5" />
      Thanks, you’re subscribed.
    </p>

    <div v-else class="mt-6 flex items-center">
      <span class="flex min-w-0 flex-auto p-px">
        <input
          v-model="email"
          type="email"
          name="email"
          placeholder="Email address"
          aria-label="Email address"
          required
          class="w-full appearance-none rounded-[calc(var(--radius-md)-1px)] bg-white px-3 py-[calc(--spacing(2)-1px)] shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-teal-500/10 focus:outline-teal-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-teal-400/10 dark:focus:outline-teal-400"
        >
      </span>
      <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">
      <AppButton type="submit" class="ml-4 flex-none" :class="pending && 'opacity-60'">
        {{ pending ? 'Joining…' : 'Join' }}
      </AppButton>
    </div>
  </form>
</template>

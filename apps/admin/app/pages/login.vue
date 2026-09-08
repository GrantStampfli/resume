<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Sign in' })

const schema = z.object({
  password: z.string().min(1, 'Password is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({ password: '' })
const error = shallowRef<string | null>(null)
const pending = shallowRef(false)

const route = useRoute()
const { fetch } = useUserSession()

async function onSubmit(event: FormSubmitEvent<Schema>): Promise<void> {
  pending.value = true
  error.value = null

  try {
    await $fetch('/api/auth/login', { method: 'POST', body: event.data })
    await fetch()
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await navigateTo(redirect)
  }
  catch (failure) {
    error.value = (failure as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Sign in failed'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-shield-check" class="size-5 text-primary" />
        <h1 class="font-semibold">
          Stampfli admin
        </h1>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" autocomplete="current-password" autofocus class="w-full" />
      </UFormField>

      <UAlert v-if="error" :title="error" color="error" variant="subtle" icon="i-lucide-triangle-alert" />

      <UButton type="submit" label="Sign in" :loading="pending" block />
    </UForm>
  </UCard>
</template>

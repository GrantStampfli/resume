<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const appConfig = useAppConfig()
const toast = useToast()

const schema = z.object({
  name: z.string().min(2, 'Please tell me your name'),
  email: z.string().email('Please use a valid email address'),
  subject: z.string().min(2, 'A subject helps me reply faster'),
  message: z.string().min(10, 'Say a little more'),
  // Honeypot: real people never fill this in.
  website: z.string().max(0).optional(),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({ name: '', email: '', subject: '', message: '', website: '' })
const pending = shallowRef(false)
const sent = shallowRef(false)

async function onSubmit(event: FormSubmitEvent<Schema>): Promise<void> {
  pending.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: event.data })
    sent.value = true
  }
  catch (error) {
    const message = (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Something went wrong'
    toast.add({ title: 'Could not send your message', description: message, color: 'error', icon: 'i-lucide-triangle-alert' })
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <section id="contact" class="scroll-mt-16 py-20 sm:py-28">
    <UContainer class="max-w-3xl">
      <SectionHeading title="Let's connect" :subtitle="`Or email ${appConfig.site.email}`" />

      <UCard v-if="sent" variant="subtle" class="text-center">
        <UIcon name="i-lucide-mail-check" class="size-10 text-primary" />
        <p class="mt-3 text-lg font-semibold text-highlighted">
          Thank you! I will get back to you soon.
        </p>
      </UCard>

      <UForm v-else :schema="schema" :state="state" class="grid gap-4 sm:grid-cols-2" @submit="onSubmit">
        <UFormField label="Your name" name="name">
          <UInput v-model="state.name" autocomplete="name" class="w-full" />
        </UFormField>
        <UFormField label="Email address" name="email">
          <UInput v-model="state.email" type="email" autocomplete="email" class="w-full" />
        </UFormField>
        <UFormField label="Subject" name="subject" class="sm:col-span-2">
          <UInput v-model="state.subject" class="w-full" />
        </UFormField>
        <UFormField label="Message" name="message" class="sm:col-span-2">
          <UTextarea v-model="state.message" :rows="6" autoresize class="w-full" />
        </UFormField>
        <input v-model="state.website" type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">

        <div class="sm:col-span-2 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-1">
            <UButton
              v-for="social in appConfig.socials"
              :key="social.to"
              :icon="social.icon"
              :to="social.to"
              :aria-label="social.label"
              color="neutral"
              variant="ghost"
              target="_blank"
            />
          </div>
          <UButton type="submit" label="Send" trailing-icon="i-lucide-send" size="lg" :loading="pending" />
        </div>
      </UForm>
    </UContainer>
  </section>
</template>

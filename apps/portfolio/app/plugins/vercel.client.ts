// @env browser

import { inject as injectAnalytics } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  injectAnalytics({
    mode: import.meta.dev ? 'development' : 'production',
  })

  injectSpeedInsights({
    route: router.currentRoute.value.matched[0]?.path ?? router.currentRoute.value.path,
  })
})

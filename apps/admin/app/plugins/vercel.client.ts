// @env browser

import { inject as injectAnalytics } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

export default defineNuxtPlugin(() => {
  injectAnalytics({
    mode: import.meta.dev ? 'development' : 'production',
  })

  injectSpeedInsights()
})

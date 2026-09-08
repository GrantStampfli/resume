// @env node

// Example of the Vercel Functions helpers: request geolocation and IP resolution.
import { geolocation, ipAddress } from '@vercel/functions'

export default defineEventHandler((event) => {
  const request = toWebRequest(event)
  const geo = geolocation(request)

  return {
    ip: ipAddress(request) ?? null,
    city: geo.city ?? null,
    country: geo.country ?? null,
    region: geo.countryRegion ?? null,
  }
})

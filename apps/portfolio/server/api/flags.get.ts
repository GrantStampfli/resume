// @env node

import { getSiteFlags } from '../utils/flags'

export default defineCachedEventHandler(() => getSiteFlags(), {
  maxAge: 60,
  swr: true,
  name: 'site-flags',
})

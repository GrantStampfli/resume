import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  // The connectors pull in optional native/driver packages; keep them external.
  external: ['db0', 'pg'],
})

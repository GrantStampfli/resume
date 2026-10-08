// @ts-check
import antfu from '@antfu/eslint-config'
import { createSlopConfig } from 'eslint-plugin-slop'

export default antfu(
  {
    type: 'app',
    vue: true,
    typescript: true,
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
    pnpm: true,
    ignores: [
      '**/.nuxt/**',
      '**/.output/**',
      '**/.vercel/**',
      '**/.data/**',
      '**/dist/**',
      '**/vendor/**',
      '**/.turbo/**',
      '.claude/skills/**',
      'apps/resume-gen/app/composer.json',
      'apps/resume-gen/app/templates/**',
      'apps/resume-gen/app/src/Resume/Console/**',
      'apps/resume-gen/app/tests/fixtures/**',
      'apps/resume-gen/resume.md',
      'apps/portfolio/content/**',
    ],
  },
).append(
  ...createSlopConfig({ cwd: import.meta.dirname, inspection: 'full' }),
)

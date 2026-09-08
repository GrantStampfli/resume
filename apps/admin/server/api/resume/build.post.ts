// @env node

// Runs the resume-gen build locally (fs driver only) so the PDF/HTML can be checked before committing.
import { execFile } from 'node:child_process'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { requireAdmin } from '../../utils/auth'
import { resolveStorageDriver } from '../../utils/store'

const run = promisify(execFile)

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  if (resolveStorageDriver(event) !== 'fs')
    throw createError({ statusCode: 400, statusMessage: 'Building is only available with the fs storage driver' })

  const cwd = resolve(useRuntimeConfig(event).storage.root, 'apps/resume-gen')

  try {
    const { stdout, stderr } = await run('node', ['scripts/build.mjs'], { cwd, timeout: 180_000 })
    return { ok: true, output: `${stdout}${stderr}`.trim() }
  }
  catch (error) {
    const failure = error as { stdout?: string, stderr?: string, message: string }
    throw createError({
      statusCode: 500,
      statusMessage: 'Resume build failed',
      data: `${failure.stdout ?? ''}${failure.stderr ?? ''}${failure.message}`.trim(),
    })
  }
})

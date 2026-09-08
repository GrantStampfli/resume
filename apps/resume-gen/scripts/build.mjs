// @env node
// Builds the static resume site into dist/ (index.html, resume.pdf, CNAME).
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, watch } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appDir = resolve(root, 'app')
const distDir = resolve(root, 'dist')
const source = resolve(root, 'resume.md')
const template = process.env.RESUME_TEMPLATE || 'modern'
const skipPdf = process.env.RESUME_SKIP_PDF === '1'
const watchMode = process.argv.includes('--watch')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', cwd: root, ...options })
  if (result.error)
    throw result.error
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} exited with code ${result.status}`)
}

function ensurePhpDependencies() {
  if (existsSync(resolve(appDir, 'vendor/autoload.php')))
    return
  console.log('> composer install (app/)')
  run('composer', ['install', '--no-interaction', '--no-progress', '--prefer-dist'], { cwd: appDir })
}

function build() {
  mkdirSync(distDir, { recursive: true })

  const resume = resolve(appDir, 'bin/resume')
  run('php', [resume, 'html', '--template', template, '--output', 'index', source, distDir])

  if (skipPdf)
    console.log('> skipping PDF (RESUME_SKIP_PDF=1)')
  else
    run('php', [resume, 'pdf', '--template', template, source, distDir])

  const cname = resolve(root, 'CNAME')
  if (existsSync(cname))
    copyFileSync(cname, resolve(distDir, 'CNAME'))

  copyFileSync(source, resolve(distDir, 'resume.md'))
}

ensurePhpDependencies()
build()

if (watchMode) {
  console.log('> watching resume.md and app/templates for changes')
  let timer
  const rebuild = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        build()
      }
      catch (error) {
        console.error(error)
      }
    }, 150)
  }
  watch(source, rebuild)
  watch(resolve(appDir, 'templates'), { recursive: true }, rebuild)
}

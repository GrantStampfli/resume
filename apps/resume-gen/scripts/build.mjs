// @env node
// Builds the static resume site into dist/ (index.html, resume.pdf, CNAME).
// Source of truth is resume.yml (structured); compiled to Markdown Extra for the PHP renderer.
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, watch, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseResumeYaml, serializeResume } from '@stampfli/resume-md'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appDir = resolve(root, 'app')
const distDir = resolve(root, 'dist')
const dataDir = resolve(root, '.data')
const checkedInYaml = resolve(root, 'resume.yml')
const checkedInMarkdown = resolve(root, 'resume.md')
const generatedMarkdown = resolve(dataDir, 'resume.md')
const generatedYaml = resolve(dataDir, 'resume.yml')
const template = process.env.RESUME_TEMPLATE || 'modern'
const skipPdf = process.env.RESUME_SKIP_PDF === '1'
const watchMode = process.argv.includes('--watch')

const databaseUrl = [
  process.env.CONTENT_DATABASE_URL,
  process.env.NUXT_CONTENT_DATABASE_URL,
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
].find(value => value && value.trim())

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

function looksLikeMarkdown(body) {
  return /^\s*#/m.test(body)
}

function compileYamlToMarkdown(yamlSource, destination) {
  const markdown = serializeResume(parseResumeYaml(yamlSource))
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, markdown, 'utf8')
  return destination
}

/**
 * With a content database configured the admin writes the resume as a row rather than a commit,
 * so the published resume has to come from that row. Imported lazily: without a database this
 * script only needs Node and PHP, no workspace install beyond @stampfli/resume-md.
 */
async function resolveSource() {
  mkdirSync(dataDir, { recursive: true })

  if (databaseUrl) {
    const { RESUME_PATH, useContentDatabase } = await import('@stampfli/content-db')
    const database = await useContentDatabase({ url: databaseUrl, rootDir: root })
    const body = await database.read(RESUME_PATH)

    if (body !== null) {
      writeFileSync(generatedYaml, body, 'utf8')
      console.log(`> building from the content database (${body.length} bytes)`)

      if (looksLikeMarkdown(body)) {
        writeFileSync(generatedMarkdown, body.endsWith('\n') ? body : `${body}\n`, 'utf8')
        console.warn('> database row looks like legacy markdown; rendering it as-is')
        return generatedMarkdown
      }

      return compileYamlToMarkdown(body, generatedMarkdown)
    }

    console.warn(`> no ${RESUME_PATH} row in the content database; building from the checkout`)
  }

  if (existsSync(checkedInYaml))
    return compileYamlToMarkdown(readFileSync(checkedInYaml, 'utf8'), generatedMarkdown)

  if (existsSync(checkedInMarkdown)) {
    console.warn('> resume.yml missing; falling back to legacy resume.md')
    return checkedInMarkdown
  }

  throw new Error('No resume.yml (or legacy resume.md) found to build')
}

async function build() {
  mkdirSync(distDir, { recursive: true })

  const source = await resolveSource()
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
  if (existsSync(checkedInYaml))
    copyFileSync(existsSync(generatedYaml) ? generatedYaml : checkedInYaml, resolve(distDir, 'resume.yml'))
}

ensurePhpDependencies()
await build()

if (watchMode) {
  console.log('> watching resume.yml and app/templates for changes')
  let timer
  const rebuild = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      build().catch(error => console.error(error))
    }, 150)
  }
  if (existsSync(checkedInYaml))
    watch(checkedInYaml, rebuild)
  if (existsSync(checkedInMarkdown))
    watch(checkedInMarkdown, rebuild)
  watch(resolve(appDir, 'templates'), { recursive: true }, rebuild)
}

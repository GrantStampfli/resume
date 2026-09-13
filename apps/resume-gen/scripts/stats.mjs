// @env node
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseResumeYaml, serializeResume } from '@stampfli/resume-md'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const yamlPath = resolve(root, 'resume.yml')
const temp = resolve(root, '.data/stats.md')
const markdown = serializeResume(parseResumeYaml(readFileSync(yamlPath, 'utf8')))

mkdirSync(dirname(temp), { recursive: true })
writeFileSync(temp, markdown, 'utf8')

const result = spawnSync('php', [resolve(root, 'app/bin/resume'), 'stats', temp], {
  stdio: 'inherit',
  cwd: root,
})
process.exit(result.status ?? 1)

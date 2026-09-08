// @env node
// Serves dist/ locally so the generated resume can be checked in a browser.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const distDir = resolve(fileURLToPath(new URL('../dist', import.meta.url)))
const port = Number(process.env.PORT || 4173)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
  let filePath = normalize(join(distDir, urlPath))

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403).end()
    return
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory())
    filePath = join(filePath, 'index.html')

  if (!existsSync(filePath)) {
    response.writeHead(404, { 'content-type': 'text/plain' }).end('Not found')
    return
  }

  response.writeHead(200, { 'content-type': types[extname(filePath)] ?? 'application/octet-stream' })
  createReadStream(filePath).pipe(response)
}).listen(port, () => {
  console.log(`> resume preview: http://localhost:${port}`)
})

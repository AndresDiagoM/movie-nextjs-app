// Copies the pages `next build` prerendered into out/ as plain files, so the build can be
// previewed or checked without a server. Preview only: Vercel still deploys the normal build,
// and anything that needs the server (sign-in, API routes, movie/series pages) won't work here.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'

const root = process.cwd()
const appDir = join(root, '.next', 'server', 'app')
const out = join(root, 'out')

if (!existsSync(appDir)) {
  console.error('Run `pnpm build` first: .next/server/app is missing.')
  process.exit(1)
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })

let pages = 0
for (const file of walk(appDir)) {
  if (!file.endsWith('.html')) continue
  const route = relative(appDir, file).split(sep).join('/').replace(/\.html$/, '')
  if (route.includes('[')) continue
  const target =
    route === 'index'
      ? join(out, 'index.html')
      : route === '_not-found'
        ? join(out, '404.html')
        : join(out, route, 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  cpSync(file, target)
  pages++
}

cpSync(join(root, '.next', 'static'), join(out, '_next', 'static'), { recursive: true })
cpSync(join(root, 'public'), out, { recursive: true })
// Next serves src/app/favicon.ico itself; a plain file server needs a copy.
cpSync(join(root, 'src', 'app', 'favicon.ico'), join(out, 'favicon.ico'))
console.log(`Static preview: ${pages} pages written to out/`)

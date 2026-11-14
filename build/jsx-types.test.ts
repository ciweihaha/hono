import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// TypeScript 7 no longer exposes `./bin/tsc` through its package exports,
// so resolve the compiler through `package.json` instead.
const compiler = join(
  dirname(createRequire(import.meta.url).resolve('typescript/package.json')),
  'bin',
  'tsc'
)
const project = fileURLToPath(new URL('./fixtures/jsx-types/tsconfig.json', import.meta.url))

describe.each(['hono/jsx', 'hono/jsx/dom'])('published %s declarations', (jsxImportSource) => {
  it.each(['react-jsx', 'react-jsxdev'])('preserves JSX attribute checking with %s', (jsx) => {
    // Resolve the package exports to dist/types, as a consumer would after a build.
    const result = spawnSync(
      process.execPath,
      [compiler, '--project', project, '--jsxImportSource', jsxImportSource, '--jsx', jsx],
      { encoding: 'utf8' }
    )
    expect(result.stdout + result.stderr).toBe('')
    expect(result.status).toBe(0)
  })
})

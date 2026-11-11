/**
 * Load bridge settings from .env.local in the project folder.
 *
 * Imported first by server.mjs, so every module after it sees these values.
 * Only variables that are not already set are taken from the file: anything
 * set in the shell that starts the bridge wins. VITE_* lines are left alone —
 * they are for the browser, and Vite reads the same file itself.
 *
 * This lets the whole configuration — the ElevenLabs key, JARVIS_FILE_ROOTS,
 * JARVIS_ACCOUNT_CONNECTORS, JARVIS_ALLOW_WRITES — live in one file, instead of
 * a shell prefix that only works on macOS and Linux.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

const file = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local')

let text = ''
try {
  text = readFileSync(file, 'utf8')
} catch {
  // No .env.local: everything stays at its default.
}

if (text) {
  const parsed = parseEnv(text)
  const loaded = []
  for (const [name, value] of Object.entries(parsed)) {
    if (name.startsWith('VITE_')) continue
    if (process.env[name] !== undefined) continue
    process.env[name] = value
    loaded.push(name)
  }
  if (loaded.length) {
    // Names only — never the values, which include API keys.
    console.log(`[jarvis] settings from .env.local: ${loaded.join(', ')}`)
  }
}

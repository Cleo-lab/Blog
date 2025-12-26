import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Critters from 'critters'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appDir = join(__dirname, '..', 'app')

const critters = new Critters({
  path: appDir,
  inlineFonts: true,
  reduceInlineStyles: true,
  pruneSource: false,
  additionalSelectors: ['.poppins'],
})

// берём финальный HTML-черновик (можно подсунуть просто layout)
const html = readFileSync(join(appDir, 'layout.tsx'), 'utf-8')

const critical = await critters.process(html) // ← правильный метод
writeFileSync(join(appDir, 'critical.css.ts'), `export default ${JSON.stringify(critical)}`)
console.log('✓ critical.css.ts создан')
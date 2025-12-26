// scripts/inline-css.mjs
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Critters from 'critters'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appDir = join(__dirname, '..', 'app')
const outFile = join(appDir, 'critical.css.ts')

const critters = new Critters({
  path: appDir,
  inlineFonts: true,
  reduceInlineStyles: true,
})

// берём ФИНАЛЬНЫЙ production-HTML
const html = await fetch('http://localhost:3000').then(r => r.text())
const critical = await critters.process(html)

writeFileSync(outFile, `export default ${JSON.stringify(critical)}`, 'utf8')
console.log('✓ critical.css.ts создан')
// filename: seo-check.js
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

if (process.argv.length < 3) {
  console.log('Usage: node seo-check.js <URL>')
  process.exit(1)
}

const url = process.argv[2]

async function checkSEO() {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const html = await res.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Проверка article
    const articles = document.querySelectorAll('article')
    console.log(`✅ Articles found: ${articles.length}`)

    // Проверка JSON-LD
    const jsonLd = document.querySelectorAll('script[type="application/ld+json"]')
    console.log(`✅ JSON-LD scripts found: ${jsonLd.length}`)

    // Проверка meta robots
    const metaRobots = document.querySelector('meta[name="robots"]')
    if (metaRobots) {
      console.log(`✅ Meta robots content: ${metaRobots.getAttribute('content')}`)
    } else {
      console.log('⚠️ Meta robots not found')
    }

    // Проверка H1
    const h1 = document.querySelectorAll('h1')
    console.log(`✅ H1 tags found: ${h1.length}`)

  } catch (err) {
    console.error('Error:', err.message)
  }
}

checkSEO()

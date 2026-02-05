// filename: seo-check-links.js
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

if (process.argv.length < 3) {
  console.log('Usage: node seo-check-links.js <URL>')
  process.exit(1)
}

const url = process.argv[2]

async function checkLinks() {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const html = await res.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Находим все <article> и ссылки внутри
    const articles = document.querySelectorAll('article')
    console.log(`✅ Articles found: ${articles.length}`)

    const linksSet = new Set()

    articles.forEach((article, index) => {
      const links = article.querySelectorAll('a[href]')
      links.forEach((link) => linksSet.add(link.href))
    })

    if (linksSet.size === 0) {
      console.log('⚠️ No links found inside articles')
    } else {
      console.log(`✅ Links found inside articles (${linksSet.size}):`)
      linksSet.forEach((l) => console.log(' -', l))
    }

  } catch (err) {
    console.error('Error:', err.message)
  }
}

checkLinks()


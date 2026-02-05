import { MetadataRoute } from 'next'

const baseUrl = 'https://yurieblog.vercel.app'  // ← без пробела!

// 🔒 Приватные зоны
const PRIVATE_PATHS = [
  '/api/',
  '/admin/',
  '/auth/',
  '/drafts/',
  '/preview/',
  '/checkout/',
  '/dashboard/',     // ← добавь если есть личный кабинет
  '/login/',
  '/signup/',
] as const

// 🤖 AI-боты (training / scraping)
const AI_SCRAPERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',           // ← Common Crawl
  'FacebookBot',     // ← Meta AI
] as const

// 🚫 Агрессивные SEO-сканеры
const AGGRESSIVE_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'BLEXBot',
  'DotBot',
  'Exabot',
  'Screaming Frog',  // ← часто агрессивный
  'Sitebulb',        // ← SEO crawler
] as const

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1️⃣ Агрессивные скраперы — полный запрет (САМОЕ СТРОГОЕ — первым!)
      {
        userAgent: [...AGGRESSIVE_BOTS],
        disallow: '/',
      },

      // 2️⃣ AI-боты — запрещаем сбор контента для обучения
      {
        userAgent: [...AI_SCRAPERS],
        disallow: '/',
      },

      // 3️⃣ ВСЕ остальные боты (Google, Bing, Yandex, DuckDuckGo, etc.)
      // ✅ Явно разрешаем индексацию всего, кроме приватных путей
      {
        userAgent: '*',
        allow: '/',           // ← ЯВНО разрешаем корень и всё остальное!
        disallow: [...PRIVATE_PATHS],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
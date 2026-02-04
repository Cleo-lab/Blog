import { MetadataRoute } from 'next'

const baseUrl = 'https://yurieblog.vercel.app'

// 🔒 Приватные зоны
const PRIVATE_PATHS = [
  '/api/',
  '/admin/',
  '/auth/',
  '/drafts/',
  '/preview/',
  '/checkout/',
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
] as const

// 🚫 Агрессивные SEO-сканеры
const AGGRESSIVE_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'BLEXBot',
  'DotBot',
  'Exabot',
] as const

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1️⃣ Агрессивные скраперы — полный запрет
      {
        userAgent: [...AGGRESSIVE_BOTS],
        disallow: '/',
      },

      // 2️⃣ AI-боты — запрещаем сбор контента
      {
        userAgent: [...AI_SCRAPERS],
        disallow: '/',
      },

      // 3️⃣ Поисковики (Google, Bing, Yandex и др.)
      {
        userAgent: '*',
        disallow: [...PRIVATE_PATHS],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

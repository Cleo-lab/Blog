import { MetadataRoute } from 'next'

const baseUrl = 'https://yurieblog.vercel.app'

// 🔒 Приватные и служебные зоны
const PRIVATE_PATHS = [
  '/api/',
  '/admin/',
  '/auth/',
  '/drafts/',
  '/preview/',
  '/checkout/',
  '/search',
] as const

// 🤖 AI-боты (НЕ блокируем полностью)
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

// 🚫 Агрессивные SEO-скраперы
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
      // 🔴 Жёстко блокируем агрессивных скраперов
      {
        userAgent: [...AGGRESSIVE_BOTS],
        disallow: '/',
      },

      // 🟡 AI-ботам разрешаем ТОЛЬКО публичный контент
      {
        userAgent: [...AI_SCRAPERS],
        allow: [
          '/',
          '/blog/',
          '/archiveblog',
        ],
        disallow: [
          ...PRIVATE_PATHS,
          '/_next/',
        ],
      },

      // 🟢 Основные поисковики
      {
        userAgent: ['Googlebot', 'Bingbot', 'YandexBot', 'DuckDuckBot'],
        allow: [
          '/',
          '/blog/',
          '/archiveblog',
          '/_next/static/',
          '/_next/image',
          '/images/',
          '/videos/',
          '/favicon.ico',
        ],
        disallow: [...PRIVATE_PATHS],
      },

      // ⚪ Все остальные
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog/',
          '/archiveblog',
        ],
        disallow: [...PRIVATE_PATHS],
        crawlDelay: 5, // мягкий hint
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

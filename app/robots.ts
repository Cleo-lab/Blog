import { MetadataRoute } from 'next'

const baseUrl = 'https://yurieblog.vercel.app'

// 🔒 Приватные и служебные зоны (сюда роботам нельзя)
const PRIVATE_PATHS = [
  '/api/',
  '/admin/',
  '/auth/',
  '/drafts/',
  '/preview/',
  '/checkout/',
  '/search', // Результаты поиска обычно не индексируют, это правильно
  '/_next/', // Системные файлы Next.js
] as const

// 🤖 AI-боты
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

// 🚫 Агрессивные SEO-скраперы (если хочешь экономить ресурсы)
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
      // 1. 🔴 Жёстко блокируем агрессивных скраперов (им нельзя никуда)
      {
        userAgent: [...AGGRESSIVE_BOTS],
        disallow: '/',
      },

      // 2. 🟢 Основные поисковики + AI + Все остальные
      // Мы объединяем их правила, чтобы не потерять страницы.
      // Логика: "Можно везде, кроме приватных папок"
      {
        userAgent: '*', // Звездочка покрывает и Google, и Bing, и AI ботов (кроме тех, кого забанили выше)
        allow: '/',     // ✅ РАЗРЕШАЕМ ВСЁ (включая /privacy, /terms, /pages-list, /gallery)
        disallow: [...PRIVATE_PATHS], // ❌ КРОМЕ этого списка
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
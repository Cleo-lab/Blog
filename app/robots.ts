import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/', 
          '/_next/static/images/', // Явно разрешаем ботам видеть оптимизированные картинки Next.js
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
        ],
      },
      {
        // Специальное правило для Bing: они иногда слишком агрессивно сканируют
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/'],
      },
      {
        // Блокируем ИИ-ботов, чтобы они не тратили ресурсы вашего сервера бесплатно
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: [
      'https://yurieblog.vercel.app/sitemap.xml',
    ],
    host: 'https://yurieblog.vercel.app',
  }
}
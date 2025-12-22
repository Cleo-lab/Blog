import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'], // Скрываем служебные страницы
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0, // Google может сканировать без задержек
      },
	  {
  userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot'], // Боты OpenAI и Common Crawl
  disallow: '/', // Запрещаем им забирать твой контент для обучения нейросетей
},
    ],
    sitemap: 'https://yurieblog.vercel.app/sitemap.xml',
    host: 'https://yurieblog.vercel.app',
  }
}
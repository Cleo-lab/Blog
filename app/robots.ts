// app/robots.ts
import { MetadataRoute } from 'next'

export const revalidate = 86400
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const blockList = [
    '/api/', '/admin/', '/auth/', '/drafts/', '/preview/', '/checkout/',
    '/_next/', '/static/'
  ]

  return {
    rules: [
      { userAgent: 'Googlebot', allow: '/', disallow: blockList, crawlDelay: 0.5 },
      { userAgent: 'Bingbot', allow: '/', disallow: blockList, crawlDelay: 1 },
      { userAgent: 'Yandex', allow: '/', disallow: blockList, crawlDelay: 2 },
      { userAgent: 'DuckDuckBot', allow: '/', disallow: blockList, crawlDelay: 1.5 },
      { userAgent: 'Slurp', allow: '/', disallow: blockList, crawlDelay: 1.5 },
      { userAgent: '*', allow: '/', disallow: blockList },
      {
        userAgent: [
          'GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web',
          'Google-Extended', 'Applebot-Extended', 'OAI-SearchBot', 'PerplexityBot',
          'Bytespider', 'AhrefsBot', 'SemrushBot', 'MJ12bot', 'BLEXBot', 'DotBot', 'Exabot'
        ],
        disallow: '/'
      }
    ],
    sitemap: 'https://yurieblog.vercel.app/sitemap.xml'
  }
}